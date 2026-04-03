package com.trustelect.dto.response;

import java.time.LocalDateTime;

import com.trustelect.model.Election;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ElectionResponse {
    private Long id;
    private String title;
    private String description;
    private Election.ElectionStatus status;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private LocalDateTime createdAt;
}
