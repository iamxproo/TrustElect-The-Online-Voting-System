package com.trustelect.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.trustelect.dto.request.CandidateRequest;
import com.trustelect.dto.response.CandidateResponse;
import com.trustelect.exception.ResourceNotFoundException;
import com.trustelect.model.Candidate;
import com.trustelect.repository.CandidateRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CandidateService {

    private final CandidateRepository candidateRepository;

    public List<CandidateResponse> getAllCandidates() {
        List<Candidate> candidates = candidateRepository.findAllByOrderByVotesDesc();
        long totalVotes = candidates.stream().mapToLong(Candidate::getVotes).sum();
        return candidates.stream()
                .map(c -> toResponse(c, totalVotes))
                .toList();
    }

    public List<CandidateResponse> getActiveCandidates() {
        List<Candidate> candidates = candidateRepository.findByActiveTrueOrderByVotesDesc();
        long totalVotes = candidates.stream().mapToLong(Candidate::getVotes).sum();
        return candidates.stream()
                .map(c -> toResponse(c, totalVotes))
                .toList();
    }

    public CandidateResponse getCandidateById(Long id) {
        Candidate candidate = findById(id);
        long totalVotes = candidateRepository.findAllByOrderByVotesDesc().stream()
                .mapToLong(Candidate::getVotes).sum();
        return toResponse(candidate, totalVotes);
    }

    @Transactional
    public CandidateResponse addCandidate(CandidateRequest request) {
        Candidate candidate = Candidate.builder()
                .name(request.getName())
                .party(request.getParty())
                .imageUrl(request.getImageUrl())
                .symbol(request.getSymbol())
                .build();
        return toResponse(candidateRepository.save(candidate), 0);
    }

    @Transactional
    public CandidateResponse updateCandidate(Long id, CandidateRequest request) {
        Candidate candidate = findById(id);
        candidate.setName(request.getName());
        candidate.setParty(request.getParty());
        if (request.getImageUrl() != null) candidate.setImageUrl(request.getImageUrl());
        if (request.getSymbol() != null) candidate.setSymbol(request.getSymbol());
        return toResponse(candidateRepository.save(candidate), 0);
    }

    @Transactional
    public void deleteCandidate(Long id) {
        Candidate candidate = findById(id);
        candidate.setActive(false);
        candidateRepository.save(candidate);
    }

    // ─── Helpers ──────────────────────────────────────────────────
    private Candidate findById(Long id) {
        return candidateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate not found with id: " + id));
    }

    public CandidateResponse toResponse(Candidate c, long totalVotes) {
        double pct = totalVotes > 0 ? (double) c.getVotes() / totalVotes * 100 : 0;
        return CandidateResponse.builder()
                .id(c.getId())
                .name(c.getName())
                .party(c.getParty())
                .imageUrl(c.getImageUrl())
                .symbol(c.getSymbol())
                .votes(c.getVotes())
                .active(c.isActive())
                .percentage(Math.round(pct * 10.0) / 10.0)
                .build();
    }
}
