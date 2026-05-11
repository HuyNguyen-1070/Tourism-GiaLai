package com.gialai.tourism.config;

import com.gialai.tourism.common.constants.Constant;
import com.gialai.tourism.config.filters.JwtAuthenticationFilter;
import com.gialai.tourism.exceptions.handlers.SecurityExceptionHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private final UserDetailsService userDetailsService;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @SuppressWarnings("deprecation")
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider();
        authenticationProvider.setUserDetailsService(userDetailsService);
        authenticationProvider.setPasswordEncoder(passwordEncoder());
        return authenticationProvider;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            JwtAuthenticationFilter jwtAuthenticationFilter,
            CorsConfigurationSource corsConfigurationSource,
            SecurityExceptionHandler securityExceptionHandler) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)
                .logout(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.GET, "/api/posts/{postId}").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/posts/{postId}/comments").permitAll()
                        // Epic 4 public endpoints
                        .requestMatchers(HttpMethod.GET, "/api/homepage/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/history-timeline").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/tourism-overview").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/events-festivals").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/attractions", "/api/attractions/*").permitAll()
                        // Epic 5 public endpoints
                        .requestMatchers(HttpMethod.GET, "/api/posts/search").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/tags").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/map/**").permitAll()
                        // other public endpoints from Constant
                        .requestMatchers(Constant.PUBLIC_ENDPOINTS).permitAll()
                        .anyRequest().authenticated()
                )
                .authenticationProvider(authenticationProvider())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint(securityExceptionHandler)
                        .accessDeniedHandler(securityExceptionHandler))
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}