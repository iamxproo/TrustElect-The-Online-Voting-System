package com.trustelect.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "candidates")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Candidate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String party;

    @Column(name = "image_url")
    private String imageUrl;

    private String symbol;

    @Column(nullable = false)
    @Builder.Default
    private long votes = 0;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private boolean active = true;
}
