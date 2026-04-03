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
import org.springframework.web.multipart.MultipartFile;

import com.trustelect.dto.request.CandidateRequest;
import com.trustelect.dto.response.ApiResponse;
import com.trustelect.dto.response.CandidateResponse;
import com.trustelect.service.CandidateService;
import com.trustelect.service.FileStorageService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/candidates")
@RequiredArgsConstructor
public class CandidateController {

    private final CandidateService candidateService;
    private final FileStorageService fileStorageService;

    /** GET /api/candidates — public */
    @GetMapping
    public ResponseEntity<ApiResponse<List<CandidateResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.ok(candidateService.getActiveCandidates()));
    }

    /** GET /api/candidates/all — admin sees soft-deleted too */
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<CandidateResponse>>> getAll_admin() {
        return ResponseEntity.ok(ApiResponse.ok(candidateService.getAllCandidates()));
    }

    /** GET /api/candidates/{id} */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CandidateResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(candidateService.getCandidateById(id)));
    }

    /** POST /api/candidates */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<CandidateResponse>> create(
            @Valid @RequestBody CandidateRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Candidate added", candidateService.addCandidate(request)));
    }

    /** POST /api/candidates/{id}/image — upload photo */
    @PostMapping("/{id}/image")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> uploadImage(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {
        String url = fileStorageService.storeFile(file);
        // patch imageUrl on the candidate
        CandidateRequest patch = new CandidateRequest();
        patch.setName(candidateService.getCandidateById(id).getName());
        patch.setParty(candidateService.getCandidateById(id).getParty());
        patch.setImageUrl(url);
        candidateService.updateCandidate(id, patch);
        return ResponseEntity.ok(ApiResponse.ok("Image uploaded", url));
    }

    /** PUT /api/candidates/{id} */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<CandidateResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody CandidateRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Candidate updated", candidateService.updateCandidate(id, request)));
    }

    /** DELETE /api/candidates/{id} */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        candidateService.deleteCandidate(id);
        return ResponseEntity.ok(ApiResponse.ok("Candidate removed", null));
    }
}
