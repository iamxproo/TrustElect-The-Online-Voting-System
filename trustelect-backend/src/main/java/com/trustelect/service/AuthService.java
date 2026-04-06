package com.trustelect.service;

import java.time.LocalDateTime;
import java.util.Random;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.trustelect.dto.request.AdminLoginRequest;
import com.trustelect.dto.request.OtpRequest;
import com.trustelect.dto.request.OtpVerifyRequest;
import com.trustelect.dto.request.VoterLoginRequest;
import com.trustelect.dto.request.VoterRegisterRequest;
import com.trustelect.dto.response.AuthResponse;
import com.trustelect.dto.response.RegisterResponse;
import com.trustelect.exception.BadRequestException;
import com.trustelect.exception.UnauthorizedException;
import com.trustelect.model.Admin;
import com.trustelect.model.OtpRecord;
import com.trustelect.model.Voter;
import com.trustelect.repository.AdminRepository;
import com.trustelect.repository.OtpRepository;
import com.trustelect.repository.VoterRepository;
import com.trustelect.security.JwtUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final AdminRepository adminRepository;
    private final VoterRepository voterRepository;
    private final OtpRepository otpRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    @Value("${app.otp.expiry:10}")
    private int otpExpiryMinutes;

    // ─── Admin Login ───────────────────────────────────────────────
    public AuthResponse adminLogin(AdminLoginRequest request) {
        Admin admin = adminRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), admin.getPassword())) {
            throw new UnauthorizedException("Invalid credentials");
        }

        String token = jwtUtil.generateToken(admin.getUsername(), "ADMIN", admin.getId());

        return AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .role("ADMIN")
                .id(admin.getId())
                .name(admin.getName())
                .username(admin.getUsername())
                .email(admin.getEmail())
                .build();
    }

    // ─── Voter Login ───────────────────────────────────────────────
    public AuthResponse voterLogin(VoterLoginRequest request) {
        String identifier = request.getVoterIdOrEmail();

        Voter voter = voterRepository.findByVoterId(identifier)
                .or(() -> voterRepository.findByEmail(identifier))
                .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));

        if (!voter.isActive()) {
            throw new UnauthorizedException("Your account has been deactivated");
        }

        if (!passwordEncoder.matches(request.getPassword(), voter.getPassword())) {
            throw new UnauthorizedException("Invalid credentials");
        }

        String token = jwtUtil.generateToken(voter.getVoterId(), "VOTER", voter.getId());

        return AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .role("VOTER")
                .id(voter.getId())
                .name(voter.getName())
                .voterId(voter.getVoterId())
                .email(voter.getEmail())
                .hasVoted(voter.isHasVoted())
                .build();
    }

    // ─── Voter Self-Registration ────────────────────────────────────
    @Transactional
    @SuppressWarnings("null")
    public RegisterResponse registerVoter(VoterRegisterRequest request) {
        if (voterRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("This email is already registered!");
        }
        if (request.getRollNumber() != null && !request.getRollNumber().isBlank()
                && voterRepository.existsByRollNumber(request.getRollNumber())) {
            throw new BadRequestException("This roll number is already registered! Each student can register only once.");
        }
        if (request.getPhone() != null && !request.getPhone().isBlank()
                && voterRepository.existsByPhone(request.getPhone())) {
            throw new BadRequestException("This phone number is already registered!");
        }

        // Build voterId from name (firstName + lastName)
        String[] parts = request.getName().trim().split("\\s+");
        String firstName = parts[0];
        String lastName = parts.length > 1 ? parts[parts.length - 1] : "";
        String baseId = (firstName + lastName).toLowerCase();
        String voterId = resolveUniqueVoterId(baseId);
        String rawPassword = voterId; // password = voterId (plain text for display)

        Voter voter = Voter.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .className(request.getClassName())
                .rollNumber(request.getRollNumber())
                .voterId(voterId)
                .password(passwordEncoder.encode(rawPassword))
                .build();

        voterRepository.save(voter);

        // Send credentials via email
        emailService.sendCredentials(voter.getEmail(), voter.getName(), voterId, rawPassword);

        return RegisterResponse.builder()
                .success(true)
                .message("Registration successful! Credentials sent to your email.")
                .voterId(voterId)
                .password(rawPassword)
                .email(voter.getEmail())
                .build();
    }

    // ─── OTP: Send ────────────────────────────────────────────────
    @Transactional
    public void sendOtp(OtpRequest request) {
        // Verify voter exists
        voterRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("No account found with this email"));

        String otp = String.format("%06d", new Random().nextInt(1_000_000));

        // Upsert OTP record
        OtpRecord record = otpRepository.findByEmail(request.getEmail())
                .orElse(OtpRecord.builder().email(request.getEmail()).build());
        record.setOtp(otp);
        record.setExpiresAt(LocalDateTime.now().plusMinutes(otpExpiryMinutes));
        record.setUsed(false);
        otpRepository.save(record);

        emailService.sendOtp(request.getEmail(), otp);
    }

    // ─── OTP: Verify ──────────────────────────────────────────────
    @Transactional
    public AuthResponse verifyOtpAndLogin(OtpVerifyRequest request) {
        OtpRecord record = otpRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("No OTP found for this email"));

        if (record.isUsed()) throw new BadRequestException("OTP already used");
        if (record.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("OTP has expired");
        }
        if (!record.getOtp().equals(request.getOtp())) {
            throw new BadRequestException("Invalid OTP");
        }

        record.setUsed(true);
        otpRepository.save(record);

        Voter voter = voterRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("Voter not found"));

        String token = jwtUtil.generateToken(voter.getVoterId(), "VOTER", voter.getId());

        return AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .role("VOTER")
                .id(voter.getId())
                .name(voter.getName())
                .voterId(voter.getVoterId())
                .email(voter.getEmail())
                .hasVoted(voter.isHasVoted())
                .build();
    }

    // ─── Helper ───────────────────────────────────────────────────
    private String resolveUniqueVoterId(String base) {
        String id = base;
        int suffix = 1;
        while (voterRepository.existsByVoterId(id)) {
            id = base + suffix++;
        }
        return id;
    }
}
