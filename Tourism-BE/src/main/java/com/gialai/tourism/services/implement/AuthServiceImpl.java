package com.gialai.tourism.services.implement;

import com.gialai.tourism.enums.RoleType;
import com.gialai.tourism.exceptions.AppException;
import com.gialai.tourism.models.DTO.auth.*;
import com.gialai.tourism.models.Entities.User;
import com.gialai.tourism.repositories.UserRepository;
import com.gialai.tourism.services.AuthService;
import com.gialai.tourism.services.JwtService;
import com.gialai.tourism.services.OtpService;
import com.gialai.tourism.services.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final OtpService otpService;
    private final EmailService emailService;

    @Override
    @Transactional
    public void register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new AppException("Username đã tồn tại", "USERNAME_EXISTS", 400);
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AppException("Email đã được sử dụng", "EMAIL_EXISTS", 400);
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(RoleType.USER)
                .build();
        userRepository.save(user);
    }

    @Override
    public String login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return jwtService.generateToken(userDetails);
    }

    @Override
    @Transactional
    public void forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException("Email không tồn tại trong hệ thống", "EMAIL_NOT_FOUND", 404));
        otpService.generateAndSendOtp(user.getEmail());
    }

    @Override
    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException("Email không tồn tại", "EMAIL_NOT_FOUND", 404));

        boolean valid = otpService.verifyOtp(request.getEmail(), request.getOtp());
        if (!valid) {
            throw new AppException("OTP không hợp lệ hoặc đã hết hạn", "INVALID_OTP", 400);
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        emailService.sendPasswordChangedNotification(user.getEmail());
    }
}