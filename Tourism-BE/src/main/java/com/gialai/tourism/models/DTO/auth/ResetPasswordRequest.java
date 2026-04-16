package com.gialai.tourism.models.DTO.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ResetPasswordRequest {
    @NotBlank private String email;
    @NotBlank private String otp;
    @NotBlank
    private String newPassword;
}