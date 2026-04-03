package com.trustelect.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.trustelect.dto.request.AdminLoginRequest;
import com.trustelect.dto.request.OtpRequest;
import com.trustelect.dto.request.OtpVerifyRequest;
import com.trustelect.dto.request.VoterLoginRequest;
import com.trustelect.dto.request.VoterRegisterRequest;
import com.trustelect.dto.response.ApiResponse;
import com.trustelect.dto.response.AuthResponse;
import com.trustelect.dto.response.RegisterResponse;
import com.trustelect.service.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /** POST /api/auth/admin/login */
    @PostMapping("/admin/login")
    public ResponseEntity<ApiResponse<AuthResponse>> adminLogin(
            @Valid @RequestBody AdminLoginRequest request) {
        AuthResponse auth = authService.adminLogin(request);
        return ResponseEntity.ok(ApiResponse.ok("Login successful", auth));
    }

    /** POST /api/auth/voter/login */
    @PostMapping("/voter/login")
    public ResponseEntity<ApiResponse<AuthResponse>> voterLogin(
            @Valid @RequestBody VoterLoginRequest request) {
        AuthResponse auth = authService.voterLogin(request);
        return ResponseEntity.ok(ApiResponse.ok("Login successful", auth));
    }

    /** POST /api/auth/voter/register */
    @PostMapping("/voter/register")
    public ResponseEntity<ApiResponse<RegisterResponse>> registerVoter(
            @Valid @RequestBody VoterRegisterRequest request) {
        RegisterResponse result = authService.registerVoter(request);
        return ResponseEntity.ok(ApiResponse.ok("Registration successful", result));
    }

    /** POST /api/auth/otp/send */
    @PostMapping("/otp/send")
    public ResponseEntity<ApiResponse<Void>> sendOtp(
            @Valid @RequestBody OtpRequest request) {
        authService.sendOtp(request);
        return ResponseEntity.ok(ApiResponse.ok("OTP sent to " + request.getEmail(), null));
    }

    /** POST /api/auth/otp/verify */
    @PostMapping("/otp/verify")
    public ResponseEntity<ApiResponse<AuthResponse>> verifyOtp(
            @Valid @RequestBody OtpVerifyRequest request) {
        AuthResponse auth = authService.verifyOtpAndLogin(request);
        return ResponseEntity.ok(ApiResponse.ok("OTP verified", auth));
    }
}
