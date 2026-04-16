package com.gialai.tourism.services;

public interface EmailService {
    void sendOtpEmail(String to, String otp);
    void sendPasswordChangedNotification(String to);
}