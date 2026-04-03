package com.trustelect.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.trustelect.dto.request.VoterRegisterRequest;
import com.trustelect.dto.response.ApiResponse;
import com.trustelect.dto.response.DashboardStatsResponse;
import com.trustelect.dto.response.RegisterResponse;
import com.trustelect.dto.response.VoterResponse;
import com.trustelect.service.VoteService;
import com.trustelect.service.VoterService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final VoterService voterService;
    private final VoteService voteService;

    // ─── Dashboard ────────────────────────────────────────────────
    /** GET /api/admin/dashboard */
    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> dashboard() {
        return ResponseEntity.ok(ApiResponse.ok(voteService.getDashboardStats()));
    }

    // ─── Voter Management ─────────────────────────────────────────
    /** GET /api/admin/voters */
    @GetMapping("/voters")
    public ResponseEntity<ApiResponse<List<VoterResponse>>> getAllVoters() {
        return ResponseEntity.ok(ApiResponse.ok(voterService.getAllVoters()));
    }

    /** GET /api/admin/voters/search?q=... */
    @GetMapping("/voters/search")
    public ResponseEntity<ApiResponse<List<VoterResponse>>> searchVoters(
            @RequestParam String q) {
        return ResponseEntity.ok(ApiResponse.ok(voterService.searchVoters(q)));
    }

    /** GET /api/admin/voters/{id} */
    @GetMapping("/voters/{id}")
    public ResponseEntity<ApiResponse<VoterResponse>> getVoter(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(voterService.getVoterById(id)));
    }

    /** POST /api/admin/voters — admin adds a voter */
    @PostMapping("/voters")
    public ResponseEntity<ApiResponse<RegisterResponse>> addVoter(
            @Valid @RequestBody VoterRegisterRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Voter added", voterService.addVoter(request)));
    }

    /** PUT /api/admin/voters/{id} */
    @PutMapping("/voters/{id}")
    public ResponseEntity<ApiResponse<VoterResponse>> updateVoter(
            @PathVariable Long id,
            @Valid @RequestBody VoterRegisterRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Voter updated", voterService.updateVoter(id, request)));
    }

    /** DELETE /api/admin/voters/{id} */
    @DeleteMapping("/voters/{id}")
    public ResponseEntity<ApiResponse<Void>> removeVoter(@PathVariable Long id) {
        voterService.removeVoter(id);
        return ResponseEntity.ok(ApiResponse.ok("Voter removed", null));
    }
}
