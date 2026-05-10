package com.gialai.tourism.services;

import com.gialai.tourism.models.entities.Account;
import com.gialai.tourism.models.entities.RefreshToken;

public interface RefreshTokenService {
    String generateRefreshToken(Account account);
    RefreshToken findByRefreshToken(String refreshToken);
    RefreshToken findByRefreshTokenWithAccount(String refreshToken);
    RefreshToken validateRefreshToken(String refreshToken);
    RefreshToken save(RefreshToken refreshToken);
    void revoke(Account account);
}
