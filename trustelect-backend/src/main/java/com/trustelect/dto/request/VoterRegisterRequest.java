package com.trustelect.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class VoterRegisterRequest {

    @NotBlank(message = "Full name is required")
    private String name;

    @Email(message = "Invalid email address")
    @NotBlank(message = "Email is required")
    private String email;

    private String phone;

    @NotBlank(message = "Class is required")
    private String className;

    @NotBlank(message = "Roll number is required")
    private String rollNumber;
}
