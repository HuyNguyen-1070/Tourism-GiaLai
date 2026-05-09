package com.gialai.tourism.services.implement;

import com.gialai.tourism.common.utils.Util;
import com.gialai.tourism.enums.CacheDuration;
import com.gialai.tourism.enums.ErrorCode;
import com.gialai.tourism.exceptions.AppException;
import com.gialai.tourism.services.CacheService;
import com.gialai.tourism.services.OtpService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class OtpServiceImpl implements OtpService {
    private static final int MAX_DAILY_SEND_REQUESTS = 5;
    private final CacheService cacheService;

    @Override
    public String generateOtp(String email) {
        try {
            String otp = Util.randomNumbers(6);
            cacheService.put(CacheDuration.CACHE_OTP.getCacheName(), email, otp);
            return otp;
        }
        catch (Exception e){
            throw new AppException(ErrorCode.OTP_SEND_FAILED);
        }
    }

    @Override
    public boolean isOtpLimitExceeded(String email, String cacheName) {
        Integer requestCount = cacheService.fetch(cacheName, email, Integer.class);
        if (requestCount == null)
            return true;
        return requestCount <= MAX_DAILY_SEND_REQUESTS;
    }

    @Override
    public void increaseRequestCount(String email, String cacheName) {
        Integer data = cacheService.fetch(cacheName, email, Integer.class);
        int requestCount = (data == null) ? 0 : data;
        cacheService.put(cacheName, email, requestCount+1);
    }

    @Override
    public boolean deleteOtp(String email, String cacheName) {
        try {
            cacheService.delete(cacheName, email);
            return true;
        }catch (Exception e){
            log.error("Failed to delete key '{}' from cache '{}'. Reason: {}", email, cacheName, e.getMessage(), e);
            return false;
        }
    }

    @Override
    public String getOtp(String email) {
        return cacheService.fetch(CacheDuration.CACHE_OTP.getCacheName(), email, String.class);
    }

    @Override
    public boolean verifyOtp(String inputOtp, String cachedOtp) {
        return cachedOtp.equals(inputOtp);
    }
}