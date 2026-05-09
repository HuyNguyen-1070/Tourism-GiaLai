package com.gialai.tourism.services;

import jakarta.servlet.http.HttpServletRequest;
import io.jsonwebtoken.Claims;
import java.util.Set;

public interface JwtService {
    String generateToken(String id, String email, Set<String> roles);
    String getToken(HttpServletRequest request);
    Claims extractClaims(String token);
    boolean validateToken(String token);
    String extractId(String token);
    Set<String> extractRoles(String token);
    String extractEmail(String token);
}
