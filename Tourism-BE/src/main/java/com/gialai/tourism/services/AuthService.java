package com.gialai.tourism.services;

import com.gialai.tourism.models.DTO.auth.*;

public interface AuthService {
    void register(RegisterRequest request);
    String login(LoginRequest request);
    void forgotPassword(ForgotPasswordRequest request);
    void resetPassword(ResetPasswordRequest request);
}