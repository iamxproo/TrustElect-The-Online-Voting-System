package com.trustelect.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.trustelect.model.OtpRecord;

public interface OtpRepository extends JpaRepository<OtpRecord, Long> {
    Optional<OtpRecord> findByEmail(String email);
    void deleteByEmail(String email);
}
