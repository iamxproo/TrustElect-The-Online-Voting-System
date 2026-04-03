package com.trustelect.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.trustelect.dto.request.CastVoteRequest;
import com.trustelect.dto.response.ApiResponse;
import com.trustelect.dto.response.CandidateResponse;
import com.trustelect.dto.response.DashboardStatsResponse;
import com.trustelect.dto.response.VoteHistoryResponse;
import com.trustelect.repository.VoterRepository;
import com.trustelect.service.CandidateService;
import com.trustelect.service.VoteService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/votes")
@RequiredArgsConstructor
public class VoteController {

    private final VoteService voteService;
    private final CandidateService candidateService;
    private final VoterRepository voterRepository;

    /** POST /api/votes — authenticated voter casts a vote */
    @PostMapping
    @PreAuthorize("hasRole('VOTER')")
    public ResponseEntity<ApiResponse<Void>> castVote(
            @Valid @RequestBody CastVoteRequest request,
            Authentication authentication) {
        Long voterId = resolveVoterId(authentication);
        voteService.castVote(voterId, request);
        return ResponseEntity.ok(ApiResponse.ok("Vote cast successfully!", null));
    }

    /** GET /api/votes/results — public live results */
    @GetMapping("/results")
    public ResponseEntity<ApiResponse<List<CandidateResponse>>> results() {
        return ResponseEntity.ok(ApiResponse.ok(candidateService.getActiveCandidates()));
    }

    /** GET /api/votes/stats — public dashboard stats */
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> stats() {
        return ResponseEntity.ok(ApiResponse.ok(voteService.getDashboardStats()));
    }

    /** GET /api/votes/history — admin only */
    @GetMapping("/history")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<VoteHistoryResponse>>> history() {
        return ResponseEntity.ok(ApiResponse.ok(voteService.getVoteHistory()));
    }

    // ─── Helper ───────────────────────────────────────────────────
    private Long resolveVoterId(Authentication authentication) {
        String voterCode = authentication.getName(); // voterId string (JWT subject)
        return voterRepository.findByVoterId(voterCode)
                .orElseThrow(() -> new com.trustelect.exception.UnauthorizedException("Voter not found"))
                .getId();
    }
}
