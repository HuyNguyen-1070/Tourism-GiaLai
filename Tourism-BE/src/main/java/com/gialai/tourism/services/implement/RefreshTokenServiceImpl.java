package com.gialai.tourism.services.implement;


import com.gialai.tourism.common.constants.MessageConstant;
import com.gialai.tourism.enums.ErrorCode;
import com.gialai.tourism.exceptions.AppException;
import com.gialai.tourism.models.entities.Account;
import com.gialai.tourism.models.entities.RefreshToken;
import com.gialai.tourism.repositories.RefreshTokenRepository;
import com.gialai.tourism.services.RefreshTokenService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class RefreshTokenServiceImpl implements RefreshTokenService {
    private final RefreshTokenRepository refreshTokenRepository;
    private static final int REFRESH_TOKEN_EXPIRY_DAYS = 7;

    @Override
    public String generateRefreshToken(Account account) {
        String newToken = UUID.randomUUID().toString();
        LocalDateTime newExpiry = LocalDateTime.now().plusDays(REFRESH_TOKEN_EXPIRY_DAYS);
        Optional<RefreshToken> oldRefreshToken = refreshTokenRepository.findByAccount(account);
        if(oldRefreshToken.isPresent()){
            RefreshToken rf = oldRefreshToken.get();
            rf.setRefreshToken(newToken);
            rf.setExpiredTime(newExpiry);
            rf.setUpdatedAt(LocalDateTime.now());
            rf.setRevokedAt(null);
            rf.setRevoked(false);
            refreshTokenRepository.save(rf);
        } else {
            RefreshToken newRefreshToken = RefreshToken.builder()
                    .refreshToken(newToken)
                    .expiredTime(newExpiry)
                    .isRevoked(false)
                    .account(account)
                    .build();
            refreshTokenRepository.save(newRefreshToken);
        }
        return newToken;
    }

    @Override
    public RefreshToken findByRefreshToken(String refreshToken) {
        return refreshTokenRepository.findByRefreshToken(refreshToken)
                .orElseThrow(() -> {
                    log.error(MessageConstant.REFRESH_TOKEN_NOT_FOUND, refreshToken);
                    return new AppException(ErrorCode.INVALID_TOKEN);
                });
    }

    @Override
    public RefreshToken findByRefreshTokenWithAccount(String refreshToken) {
        return refreshTokenRepository.findByRefreshTokenWithAccount(refreshToken)
                .orElseThrow(() -> {
                    log.error(MessageConstant.REFRESH_TOKEN_NOT_FOUND, refreshToken);
                    return new AppException(ErrorCode.INVALID_TOKEN);
                });
    }

    @Override
    public RefreshToken save(RefreshToken refreshToken) {
        return refreshTokenRepository.save(refreshToken);
    }

    @Transactional
    @Override
    public void revoke(Account account) {
        refreshTokenRepository.findByAccount(account).ifPresent(token -> {
            token.setRevoked(true);
            token.setRevokedAt(LocalDateTime.now());
            refreshTokenRepository.save(token);
        });
    }

    @Override
    public RefreshToken validateRefreshToken(String refreshToken) {
        RefreshToken token = findByRefreshTokenWithAccount(refreshToken);
        if (token.isRevoked()){
            log.error(MessageConstant.REFRESH_TOKEN_IS_REVOKED, refreshToken);
            throw new AppException(ErrorCode.INVALID_TOKEN);
        }
        if (token.getExpiredTime().isBefore(LocalDateTime.now())){
            log.error(MessageConstant.REFRESH_TOKEN_IS_EXPIRED, refreshToken);
            throw new AppException(ErrorCode.INVALID_TOKEN);
        }
        return token;
    }
}