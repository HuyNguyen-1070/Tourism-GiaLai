package com.gialai.tourism.services;

public interface OtpService {
    String generateOtp(String email);
    boolean isOtpLimitExceeded(String email, String cacheName);
    void increaseRequestCount(String email, String cacheName);
    boolean deleteOtp(String email, String cacheName);
    String getOtp(String email);
    boolean verifyOtp(String email, String inputOtp);
}

