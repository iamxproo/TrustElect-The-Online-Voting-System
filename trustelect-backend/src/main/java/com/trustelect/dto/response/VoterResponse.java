package com.trustelect.dto.response;

import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VoterResponse {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String className;
    private String rollNumber;
    private String voterId;
    private boolean hasVoted;
    private LocalDateTime votedAt;
    private LocalDateTime createdAt;
    private boolean active;
}
