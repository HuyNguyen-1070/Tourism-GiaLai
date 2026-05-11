package com.gialai.tourism.enums;

import lombok.Getter;

import java.time.Duration;

@Getter
public enum CacheDuration {
    CACHE_OTP("cacheOtp", Duration.ofMinutes(5)),
    CACHE_RESEND_OTP_REQUEST("cachedResendOtpRequestsPerDay", Duration.ofHours(24)),
    CACHE_REGISTRATION("cacheRegistration", Duration.ofHours(1)),
    CACHE_RESEND_OTP_REQUEST_FOR_REGISTER("cachedResendOtpRequestsForRegister", Duration.ofHours(1)),
    CACHE_VERIFIED_EMAILS("cacheVerifiedEmails", Duration.ofHours(12)),
    CACHE_ALL_TAGS("allTags", Duration.ofHours(1)),
    CACHE_ALL_MAP_LOCATIONS("allMapLocations", Duration.ofMinutes(10)),
    CACHE_FEATURED_POSTS("featuredPosts", Duration.ofMinutes(15)),
    CACHE_ATTRACTIVE_LOCATIONS("attractiveLocations", Duration.ofMinutes(30)),
    CACHE_CULTURAL_EVENTS("culturalEvents", Duration.ofMinutes(30));

    private final String cacheName;
    private final Duration duration;

    CacheDuration(String cacheName, Duration duration){
        this.cacheName = cacheName;
        this.duration = duration;
    }

}
