package com.trustelect.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.trustelect.dto.response.ApiResponse;
import com.trustelect.dto.response.VoterResponse;
import com.trustelect.exception.UnauthorizedException;
import com.trustelect.model.Voter;
import com.trustelect.repository.VoterRepository;
import com.trustelect.service.VoterService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/voter")
@PreAuthorize("hasRole('VOTER')")
@RequiredArgsConstructor
public class VoterController {

    private final VoterService voterService;
    private final VoterRepository voterRepository;

    /** GET /api/voter/me — voter's own profile */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<VoterResponse>> getMe(Authentication authentication) {
        Voter voter = resolveVoter(authentication);
        return ResponseEntity.ok(ApiResponse.ok(voterService.toResponse(voter)));
    }

    // ─── Helper ───────────────────────────────────────────────────
    private Voter resolveVoter(Authentication authentication) {
        String voterCode = authentication.getName();
        return voterRepository.findByVoterId(voterCode)
                .orElseThrow(() -> new UnauthorizedException("Voter not found"));
    }
}
