package com.trustelect.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String type;
    private String role;
    private Long id;
    private String name;
    private String username;
    private String voterId;
    private String email;
    private boolean hasVoted;
}
