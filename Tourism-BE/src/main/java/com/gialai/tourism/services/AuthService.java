package com.gialai.tourism.services;

import com.gialai.tourism.models.dto.auth.TokenDTO;

public interface AuthService {
    TokenDTO refreshToken(String refreshToken);
}
