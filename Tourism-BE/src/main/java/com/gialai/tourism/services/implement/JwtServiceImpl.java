package com.gialai.tourism.services.implement;

import com.gialai.tourism.services.JwtService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Slf4j
public class JwtServiceImpl implements JwtService {
    private final SecretKey key;

    public JwtServiceImpl(@Value("${JWT_SECRET}") String SECRET_KEY) {
        this.key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8));
    }

    @Override
    public String generateToken(String id, String email, Set<String> roles) {
        return Jwts.builder()
                .subject(id)
                .claim("email", email)
                .claim("roles", roles)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 3600000))
                .signWith(key)
                .compact();
    }

    @Override
    public String getToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        return null;
    }

    @Override
    public boolean validateToken(String token) {
        try {
            extractClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            log.error("Fail to validate token: {}", e.getMessage(), e);
            return false;
        }
    }

    @Override
    public Claims extractClaims(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    @Override
    public String extractId(String token) {
        return extractClaims(token).getSubject();
    }

    @Override
    public Set<String> extractRoles(String token) {
        Object rolesObj = extractClaims(token).get("roles");
        if (rolesObj instanceof List<?> rawList) {
            return rawList.stream()
                    .map(Object::toString)
                    .collect(Collectors.toSet());
        }
        return Set.of();
    }

    @Override
    public String extractEmail(String token) {
        return extractClaims(token).get("email", String.class);
    }
}