package com.trustelect.service;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.trustelect.dto.request.VoterRegisterRequest;
import com.trustelect.dto.response.RegisterResponse;
import com.trustelect.dto.response.VoterResponse;
import com.trustelect.exception.BadRequestException;
import com.trustelect.exception.ResourceNotFoundException;
import com.trustelect.model.Voter;
import com.trustelect.repository.VoterRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class VoterService {

    private final VoterRepository voterRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public List<VoterResponse> getAllVoters() {
        return voterRepository.findAllActive().stream()
                .map(this::toResponse)
                .toList();
    }

    public VoterResponse getVoterById(Long id) {
        return toResponse(findById(id));
    }

    @Transactional
    @SuppressWarnings("null")
    public RegisterResponse addVoter(VoterRegisterRequest request) {
        if (voterRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("This email is already registered!");
        }
        if (request.getRollNumber() != null && !request.getRollNumber().isBlank()
                && voterRepository.existsByRollNumber(request.getRollNumber())) {
            throw new BadRequestException("This roll number is already registered!");
        }
        if (request.getPhone() != null && !request.getPhone().isBlank()
                && voterRepository.existsByPhone(request.getPhone())) {
            throw new BadRequestException("This phone number is already registered!");
        }

        String voterId = "VTR" + System.currentTimeMillis() % 1_000_000;
        String rawPassword = generatePassword();

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
        emailService.sendCredentials(voter.getEmail(), voter.getName(), voterId, rawPassword);

        return RegisterResponse.builder()
                .success(true)
                .message("Voter added successfully")
                .voterId(voterId)
                .password(rawPassword)
                .email(voter.getEmail())
                .build();
    }

    @Transactional
    @SuppressWarnings("null")
    public VoterResponse updateVoter(Long id, VoterRegisterRequest request) {
        Voter voter = findById(id);

        if (!voter.getEmail().equals(request.getEmail())
                && voterRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already in use by another voter");
        }
        if (request.getRollNumber() != null && !request.getRollNumber().isBlank()
                && !request.getRollNumber().equals(voter.getRollNumber())
                && voterRepository.existsByRollNumber(request.getRollNumber())) {
            throw new BadRequestException("Roll number already in use by another voter");
        }

        voter.setName(request.getName());
        voter.setEmail(request.getEmail());
        voter.setPhone(request.getPhone());
        voter.setClassName(request.getClassName());
        voter.setRollNumber(request.getRollNumber());

        return toResponse(voterRepository.save(voter));
    }

    @Transactional
    @SuppressWarnings("null")
    public void removeVoter(Long id) {
        Voter voter = findById(id);
        voter.setActive(false);
        voterRepository.save(voter);
    }

    public List<VoterResponse> searchVoters(String query) {
        return voterRepository.searchVoters(query).stream()
                .map(this::toResponse)
                .toList();
    }

    public long getTotalVoters()  { return voterRepository.countByActiveTrue(); }
    public long getVotedCount()   { return voterRepository.countByHasVotedTrue(); }

    // ─── Helpers ──────────────────────────────────────────────────
    @SuppressWarnings("null")
    private Voter findById(Long id) {
        return voterRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Voter not found with id: " + id));
    }

    private String generatePassword() {
        String chars = "abcdefghijklmnopqrstuvwxyz0123456789";
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 8; i++) {
            sb.append(chars.charAt((int) (Math.random() * chars.length())));
        }
        return sb.toString();
    }

    public VoterResponse toResponse(Voter v) {
        return VoterResponse.builder()
                .id(v.getId())
                .name(v.getName())
                .email(v.getEmail())
                .phone(v.getPhone())
                .className(v.getClassName())
                .rollNumber(v.getRollNumber())
                .voterId(v.getVoterId())
                .hasVoted(v.isHasVoted())
                .votedAt(v.getVotedAt())
                .createdAt(v.getCreatedAt())
                .active(v.isActive())
                .build();
    }
}
