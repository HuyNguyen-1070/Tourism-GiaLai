package com.gialai.tourism.services.implement;

import com.gialai.tourism.models.dto.auth.TokenDTO;
import com.gialai.tourism.models.entities.Account;
import com.gialai.tourism.models.entities.RefreshToken;
import com.gialai.tourism.services.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final RefreshTokenService refreshTokenService;
    private final JwtService jwtService;

    @Override
    public TokenDTO refreshToken(String refreshToken) {
        RefreshToken token = refreshTokenService.findByRefreshToken(refreshToken);
        Account account = token.getAccount();
        Set<String> roleNames = account.getRoles().stream()
                .map(role -> role.getName().name())
                .collect(Collectors.toSet());
        String newAccessToken = jwtService.generateToken(account.getId(), account.getEmail(), roleNames);
        String newRefreshToken = refreshTokenService.generateRefreshToken(account);
        return TokenDTO.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .build();
    }
}
