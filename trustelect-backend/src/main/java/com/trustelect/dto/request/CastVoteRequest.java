package com.trustelect.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CastVoteRequest {

    @NotNull(message = "Candidate ID is required")
    private Long candidateId;
}
