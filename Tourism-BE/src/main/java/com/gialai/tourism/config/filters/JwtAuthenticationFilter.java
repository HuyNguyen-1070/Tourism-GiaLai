package com.gialai.tourism.config.filters;

import com.gialai.tourism.common.constants.Constant;
import com.gialai.tourism.models.entities.RefreshToken;
import com.gialai.tourism.services.JwtService;
import com.gialai.tourism.services.RefreshTokenService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.lang.NonNull;

import java.io.IOException;
import java.util.Arrays;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final UserDetailsService userDetailsService;
    private final RefreshTokenService refreshTokenService;
    private final JwtService jwtService;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();
        return Arrays.stream(Constant.PUBLIC_ENDPOINTS).anyMatch(path::startsWith);
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull  HttpServletResponse response, @NonNull  FilterChain filterChain)
            throws ServletException, IOException {
        String path = request.getRequestURI();
        if(Constant.REFRESH_TOKEN_ENDPOINT.equals(path)){
            handleRefreshTokenRequest(request, response, filterChain);
            return;
        }
        handleNormalRequest(request, response, filterChain);
    }

    private void handleRefreshTokenRequest(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException{
        String refreshToken = request.getHeader(Constant.REFRESH_TOKEN);
        if(refreshToken != null){
            RefreshToken validatedToken = refreshTokenService.validateRefreshToken(refreshToken);
            String email = validatedToken.getAccount().getEmail();
            setAuthenticationToSecurityContext(email);
        }
        filterChain.doFilter(request, response);
    }

    private void handleNormalRequest(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException{
        String token = jwtService.getToken(request);
        if (token != null && jwtService.validateToken(token)) {
            String email = jwtService.extractEmail(token);
            setAuthenticationToSecurityContext(email);
        }
        filterChain.doFilter(request, response);
    }

    private void setAuthenticationToSecurityContext(String email) {
        UserDetails userDetails = userDetailsService.loadUserByUsername(email);
        if (!userDetails.isEnabled()) {
            SecurityContextHolder.clearContext();
            return;
        }
        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }
}
