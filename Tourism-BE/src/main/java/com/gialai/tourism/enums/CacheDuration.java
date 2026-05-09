package com.gialai.tourism.enums;

import lombok.Getter;

import java.time.Duration;

@Getter
public enum CacheDuration {
    CACHE_OTP("cacheOtp", Duration.ofMinutes(5)),
    CACHE_RESEND_OTP_REQUEST("cachedResendOtpRequestsPerDay", Duration.ofHours(24)),
    CACHE_REGISTRATION("cacheRegistration", Duration.ofHours(1)),
    CACHE_RESEND_OTP_REQUEST_FOR_REGISTER("cachedResendOtpRequestsForRegister", Duration.ofHours(1)),
    CACHE_VERIFIED_EMAILS("cacheVerifiedEmails", Duration.ofHours(12));

    private final String cacheName;
    private final Duration duration;

    CacheDuration(String cacheName, Duration duration){
        this.cacheName = cacheName;
        this.duration = duration;
    }

}
