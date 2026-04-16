package com.gialai.tourism.services;

public interface TokenBlacklistService {
    void blacklistToken(String token, long expirationMillis);
    boolean isBlacklisted(String token);
}