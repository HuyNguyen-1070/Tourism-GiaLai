package com.gialai.tourism.models.DTO.auth;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;

@Data
public class LoginRequest {
    @NotBlank private String username;
    @NotBlank
    private String password;
}
