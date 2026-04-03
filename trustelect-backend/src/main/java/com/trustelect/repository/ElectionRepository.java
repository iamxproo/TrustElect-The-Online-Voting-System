package com.trustelect.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.trustelect.model.Election;

public interface ElectionRepository extends JpaRepository<Election, Long> {
    Optional<Election> findFirstByStatusOrderByCreatedAtDesc(Election.ElectionStatus status);
    Optional<Election> findFirstByOrderByCreatedAtDesc();
}
