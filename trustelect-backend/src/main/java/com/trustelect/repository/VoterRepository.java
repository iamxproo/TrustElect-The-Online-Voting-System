package com.trustelect.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.trustelect.model.Voter;

public interface VoterRepository extends JpaRepository<Voter, Long> {
    Optional<Voter> findByVoterId(String voterId);
    Optional<Voter> findByEmail(String email);
    Optional<Voter> findByVoterIdAndPassword(String voterId, String password);
    boolean existsByEmail(String email);
    boolean existsByVoterId(String voterId);
    long countByHasVotedTrue();
    long countByActiveTrue();

    @Query("SELECT v FROM Voter v WHERE v.active = true ORDER BY v.createdAt DESC")
    List<Voter> findAllActive();

    @Query("SELECT v FROM Voter v WHERE " +
           "LOWER(v.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(v.email) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(v.voterId) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Voter> searchVoters(String query);
}
