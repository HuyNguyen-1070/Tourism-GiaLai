package com.gialai.tourism.services;

public interface OtpService {
    void generateAndSendOtp(String email);
    boolean verifyOtp(String email, String otpCode);
}