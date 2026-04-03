package com.trustelect.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class VoterLoginRequest {

    @NotBlank(message = "Voter ID or email is required")
    private String voterIdOrEmail;

    @NotBlank(message = "Password is required")
    private String password;
}
