package com.trustelect.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "voters")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Voter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    private String phone;

    @Column(name = "class_name")
    private String className;

    @Column(name = "roll_number")
    private String rollNumber;

    @Column(name = "voter_id", nullable = false, unique = true)
    private String voterId;

    @Column(nullable = false)
    private String password;

    @Column(name = "has_voted", nullable = false)
    @Builder.Default
    private boolean hasVoted = false;

    @Column(name = "voted_for")
    private Long votedFor;

    @Column(name = "voted_at")
    private LocalDateTime votedAt;

    @Column(name = "created_at", nullable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private boolean active = true;
}
