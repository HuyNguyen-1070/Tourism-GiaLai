package com.gialai.tourism.models.DTO.auth;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private String type = "Bearer";
    private Long userId;
    private String username;
    private String role;

    public LoginResponse (String token, Long userId, String username, String role){
        this.token = token;
        this.userId = userId;
        this.username = username;
        this.role = role;
    }
}