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
import org.springframework.web.bind.annotation.RestController;

import com.trustelect.dto.request.ElectionRequest;
import com.trustelect.dto.response.ApiResponse;
import com.trustelect.dto.response.ElectionResponse;
import com.trustelect.service.ElectionService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/election")
@RequiredArgsConstructor
public class ElectionController {

    private final ElectionService electionService;

    /** GET /api/election/current — public */
    @GetMapping("/current")
    public ResponseEntity<ApiResponse<ElectionResponse>> getCurrent() {
        return ResponseEntity.ok(ApiResponse.ok(electionService.getCurrentElection()));
    }

    /** GET /api/election — admin */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<ElectionResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.ok(electionService.getAllElections()));
    }

    /** POST /api/election */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ElectionResponse>> create(
            @Valid @RequestBody ElectionRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Election created", electionService.createElection(request)));
    }

    /** PUT /api/election/{id} */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ElectionResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody ElectionRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Election updated", electionService.updateElection(id, request)));
    }

    /** DELETE /api/election/{id} */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        electionService.deleteElection(id);
        return ResponseEntity.ok(ApiResponse.ok("Election deleted", null));
    }
}
