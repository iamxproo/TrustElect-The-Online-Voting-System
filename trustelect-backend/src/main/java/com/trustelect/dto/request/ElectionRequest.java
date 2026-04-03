package com.trustelect.dto.request;

import com.trustelect.model.Election;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ElectionRequest {

    @NotBlank(message = "Election title is required")
    private String title;

    private String description;

    @NotNull(message = "Status is required")
    private Election.ElectionStatus status;

    private LocalDateTime startDate;
    private LocalDateTime endDate;
}
