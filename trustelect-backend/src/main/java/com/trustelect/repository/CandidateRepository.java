package com.trustelect.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.trustelect.model.Candidate;

public interface CandidateRepository extends JpaRepository<Candidate, Long> {
    List<Candidate> findByActiveTrueOrderByVotesDesc();
    List<Candidate> findAllByOrderByVotesDesc();
    boolean existsByNameAndParty(String name, String party);
}
