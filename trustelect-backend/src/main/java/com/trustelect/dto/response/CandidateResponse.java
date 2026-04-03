package com.trustelect.dto.response;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CandidateResponse {
    private Long id;
    private String name;
    private String party;
    private String imageUrl;
    private String symbol;
    private long votes;
    private boolean active;
    private double percentage;
}
