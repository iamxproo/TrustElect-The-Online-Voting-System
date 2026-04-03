package com.trustelect.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.trustelect.model.Vote;

public interface VoteRepository extends JpaRepository<Vote, Long> {
    Optional<Vote> findByVoterId(Long voterId);
    boolean existsByVoterId(Long voterId);
    long countByCandidateId(Long candidateId);

    @Query("SELECT v FROM Vote v ORDER BY v.timestamp DESC")
    List<Vote> findAllOrderByTimestampDesc();
}
