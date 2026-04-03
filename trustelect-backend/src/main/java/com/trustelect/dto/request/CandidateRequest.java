package com.trustelect.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CandidateRequest {

    @NotBlank(message = "Candidate name is required")
    private String name;

    @NotBlank(message = "Party name is required")
    private String party;

    private String imageUrl;

    private String symbol;
}
