package com.gialai.tourism.services;

import org.springframework.security.core.userdetails.UserDetails;
import java.util.Date;

public interface JwtService {
    String extractUsername(String token);
    String generateToken(UserDetails userDetails);
    boolean validateToken(String token, UserDetails userDetails);
    Date extractExpiration(String token);
}