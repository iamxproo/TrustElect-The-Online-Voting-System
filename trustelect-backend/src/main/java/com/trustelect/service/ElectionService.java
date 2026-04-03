package com.trustelect.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.trustelect.dto.request.ElectionRequest;
import com.trustelect.dto.response.ElectionResponse;
import com.trustelect.exception.ResourceNotFoundException;
import com.trustelect.model.Election;
import com.trustelect.repository.ElectionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ElectionService {

    private final ElectionRepository electionRepository;

    public List<ElectionResponse> getAllElections() {
        return electionRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public ElectionResponse getCurrentElection() {
        return electionRepository
                .findFirstByStatusOrderByCreatedAtDesc(Election.ElectionStatus.ACTIVE)
                .or(() -> electionRepository.findFirstByOrderByCreatedAtDesc())
                .map(this::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("No election found"));
    }

    public ElectionResponse getElectionById(Long id) {
        return toResponse(findById(id));
    }

    @Transactional
    public ElectionResponse createElection(ElectionRequest request) {
        Election election = Election.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .status(request.getStatus())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .build();
        return toResponse(electionRepository.save(election));
    }

    @Transactional
    public ElectionResponse updateElection(Long id, ElectionRequest request) {
        Election election = findById(id);
        election.setTitle(request.getTitle());
        election.setDescription(request.getDescription());
        election.setStatus(request.getStatus());
        election.setStartDate(request.getStartDate());
        election.setEndDate(request.getEndDate());
        return toResponse(electionRepository.save(election));
    }

    @Transactional
    public void deleteElection(Long id) {
        electionRepository.delete(findById(id));
    }

    // ─── Helpers ──────────────────────────────────────────────────
    private Election findById(Long id) {
        return electionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Election not found with id: " + id));
    }

    private ElectionResponse toResponse(Election e) {
        return ElectionResponse.builder()
                .id(e.getId())
                .title(e.getTitle())
                .description(e.getDescription())
                .status(e.getStatus())
                .startDate(e.getStartDate())
                .endDate(e.getEndDate())
                .createdAt(e.getCreatedAt())
                .build();
    }
}
