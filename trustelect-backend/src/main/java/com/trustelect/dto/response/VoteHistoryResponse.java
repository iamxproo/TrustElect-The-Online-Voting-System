package com.trustelect.dto.response;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VoteHistoryResponse {
    private Long id;
    private String voterCode;
    private String voterName;
    private Long candidateId;
    private String candidateName;
    private LocalDateTime timestamp;
}
