package com.gialai.tourism.services.implement;

import com.gialai.tourism.enums.CacheDuration;
import com.gialai.tourism.enums.ErrorCode;
import com.gialai.tourism.enums.RoleType;
import com.gialai.tourism.exceptions.AppException;
import com.gialai.tourism.models.mappers.AccountMapper;
import com.gialai.tourism.models.dto.auth.*;
import com.gialai.tourism.models.entities.Account;
import com.gialai.tourism.models.entities.RefreshToken;
import com.gialai.tourism.models.entities.Role;
import com.gialai.tourism.repositories.AccountRepository;
import com.gialai.tourism.services.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gialai.tourism.enums.AuthProvider;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.springframework.beans.factory.annotation.Value;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AccountServiceImpl implements AccountService {
    @Value("${google.client-id}")
    private String googleClientId;

    private final EmailService emailService;
    private final OtpService otpService;
    private final PasswordService passwordService;
    private final AccountRepository accountRepository;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final AccountMapper accountMapper;
    private final RoleService roleService;
    private final CacheService cacheService;

    @Override
    public void forgotPassword(ForgotPasswordDTO forgotPasswordDTO) {
        String email = forgotPasswordDTO.getEmail();
        findByEmail(forgotPasswordDTO.getEmail());
        if (!otpService.isOtpLimitExceeded(email, CacheDuration.CACHE_RESEND_OTP_REQUEST.getCacheName())) {
            otpService.deleteOtp(email, CacheDuration.CACHE_OTP.getCacheName());
            throw new AppException(ErrorCode.OTP_LIMIT_EXCEEDED, "the daily Resend");
        }
        otpService.increaseRequestCount(email, CacheDuration.CACHE_RESEND_OTP_REQUEST.getCacheName());
        emailService.sendOtpByEmail(email);
    }

    @Override
    public void verifyOtp(OtpVerificationDTO otpVerificationDTO) {
        String cachedOtp = otpService.getOtp(otpVerificationDTO.getEmail());
        if (cachedOtp != null && otpService.verifyOtp(otpVerificationDTO.getOtp(), cachedOtp)) {
            otpService.deleteOtp(otpVerificationDTO.getEmail(), CacheDuration.CACHE_OTP.getCacheName());
            cacheService.put(CacheDuration.CACHE_VERIFIED_EMAILS.getCacheName(), otpVerificationDTO.getEmail(), true);
        } else
            throw new AppException(ErrorCode.INVALID_OTP, "");
    }

    @Override
    public void updatePassword(UpdatePasswordDTO updatePasswordDTO) {
        if (!Boolean.TRUE.equals(cacheService.fetch(CacheDuration.CACHE_VERIFIED_EMAILS.getCacheName(),
                updatePasswordDTO.getEmail(), Boolean.class)))
            throw new AppException(ErrorCode.OTP_NOT_VERIFIED);
        Account account = findByEmail(updatePasswordDTO.getEmail());
        String password = passwordService.encryptPassword(updatePasswordDTO.getNewPassword());
        account.setPassword(password);
        accountRepository.save(account);
        cacheService.delete(CacheDuration.CACHE_VERIFIED_EMAILS.getCacheName(), updatePasswordDTO.getEmail());
    }

    @Override
    public Account findByEmail(String email) {
        return accountRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND, "Account"));
    }

    @Override
    public AuthenticationDTO login(LoginDTO loginDTO) {
        Account account = accountRepository.findByUsername(loginDTO.getUsername())
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_CREDENTIALS));
        if (!passwordService.matches(loginDTO.getPassword(), account.getPassword())) {
            throw new AppException(ErrorCode.INVALID_CREDENTIALS);
        }
        if (!account.isActive()) {
            throw new AppException(ErrorCode.ACCOUNT_LOCKED);
        }
        Set<String> roleNames = account.getRoles().stream()
                .map(role -> role.getName().name())
                .collect(Collectors.toSet());
        String accessToken = jwtService.generateToken(account.getId(), account.getEmail(), roleNames);
        String refreshToken = refreshTokenService.generateRefreshToken(account);
        return AuthenticationDTO.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .account(accountMapper.toDTO(account))
                .build();
    }

    @Override
    public void register(RegisterDTO dto) {
        if (!dto.getPassword().equals(dto.getConfirmPassword())) {
            throw new AppException(ErrorCode.PASSWORD_MISMATCH);
        }
        if (accountRepository.existsByEmail(dto.getEmail())) {
            throw new AppException(ErrorCode.RESOURCE_ALREADY_EXISTS, "Email");
        }
        if (accountRepository.existsByUsername(dto.getUsername())) {
            throw new AppException(ErrorCode.RESOURCE_ALREADY_EXISTS, "Username");
        }
        RegisterDTO cacheData = new RegisterDTO();
        cacheData.setFullName(dto.getFullName());
        cacheData.setUsername(dto.getUsername());
        cacheData.setEmail(dto.getEmail());
        cacheData.setPassword(passwordService.encryptPassword(dto.getPassword()));
        cacheService.put(CacheDuration.CACHE_REGISTRATION.getCacheName(), dto.getEmail(), cacheData);
        emailService.sendOtpByEmail(dto.getEmail());
    }

    @Override
    public void verifyRegistrationByOtp(OtpVerificationDTO otpVerificationDTO) {
        RegisterDTO cachedRegistration = cacheService.fetch(
                CacheDuration.CACHE_REGISTRATION.getCacheName(),
                otpVerificationDTO.getEmail(),
                RegisterDTO.class);
        if (cachedRegistration == null) {
            otpService.deleteOtp(otpVerificationDTO.getEmail(), CacheDuration.CACHE_OTP.getCacheName());
            throw new AppException(ErrorCode.INVALID_OTP, "Register's");
        }
        String cachedOtp = otpService.getOtp(otpVerificationDTO.getEmail());
        if (cachedOtp == null || !otpService.verifyOtp(otpVerificationDTO.getOtp(), cachedOtp)) {
            throw new AppException(ErrorCode.INVALID_OTP, "Register's");
        }
        Role userRole = roleService.getByType(RoleType.USER).orElse(null);
        Account account = accountMapper.mapRegisterDtoToEntity(cachedRegistration, userRole);
        accountRepository.save(account);
        cacheService.delete(CacheDuration.CACHE_REGISTRATION.getCacheName(), otpVerificationDTO.getEmail());
        cacheService.delete(CacheDuration.CACHE_RESEND_OTP_REQUEST_FOR_REGISTER.getCacheName(),
                otpVerificationDTO.getEmail());
        otpService.deleteOtp(otpVerificationDTO.getEmail(), CacheDuration.CACHE_OTP.getCacheName());
    }

    @Override
    public void logout(String refreshToken) {
        RefreshToken rf = refreshTokenService.findByRefreshToken(refreshToken);
        rf.setRevoked(true);
        rf.setRevokedAt(LocalDateTime.now());
        refreshTokenService.save(rf);
    }

    @Override
    public boolean existsByEmail(String email) {
        return accountRepository.existsByEmail(email);
    }

    @Override
    public boolean existsByRole(RoleType roleType) {
        return accountRepository.existsByRoles_Name(roleType);
    }

    @Override
    public void save(Account account) {
        accountRepository.save(account);
    }

    @Override
    public void requestChangePasswordOtp(String email) {
        if (!otpService.isOtpLimitExceeded(email, CacheDuration.CACHE_RESEND_OTP_REQUEST.getCacheName())) {
            otpService.deleteOtp(email, CacheDuration.CACHE_OTP.getCacheName());
            throw new AppException(ErrorCode.OTP_LIMIT_EXCEEDED, "the daily Resend");
        }
        otpService.increaseRequestCount(email, CacheDuration.CACHE_RESEND_OTP_REQUEST.getCacheName());
        emailService.sendOtpByEmail(email);
    }

    @Override
    public void changePassword(ChangePasswordDTO dto, String email) {

        Account account = findByEmail(email);
        if (!passwordService.matches(dto.getCurrentPassword(), account.getPassword())) {
            throw new AppException(ErrorCode.INVALID_CURRENT_PASSWORD);
        }
        if (!dto.getNewPassword().equals(dto.getConfirmPassword())) {
            throw new AppException(ErrorCode.PASSWORD_MISMATCH);
        }
        if (passwordService.matches(dto.getNewPassword(), account.getPassword())) {
            throw new AppException(ErrorCode.PASSWORD_SAME_AS_OLD);
        }

        String cachedOtp = otpService.getOtp(email);
        if (cachedOtp == null || !otpService.verifyOtp(dto.getOtp(), cachedOtp)) {
            throw new AppException(ErrorCode.INVALID_OTP, "Change password");
        }

        otpService.deleteOtp(email, CacheDuration.CACHE_OTP.getCacheName());

        account.setPassword(passwordService.encryptPassword(dto.getNewPassword()));
        accountRepository.save(account);
    }

    @Transactional
    @Override
    public void delete(String email) {
        Account account = findByEmail(email);
        if (account.isActive()) {
            account.setActive(false);
            accountRepository.save(account);
        }
        refreshTokenService.revoke(account);
    }

    @Override
    public AuthenticationDTO loginWithGoogle(GoogleLoginDTO dto) {
        try {
            NetHttpTransport transport = new NetHttpTransport();
            GsonFactory jsonFactory = GsonFactory.getDefaultInstance();

            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(transport, jsonFactory)
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(dto.getIdToken());
            if (idToken == null) {
                throw new AppException(ErrorCode.INVALID_TOKEN);
            }

            GoogleIdToken.Payload payload = idToken.getPayload();
            String email = payload.getEmail();
            String fullName = (String) payload.get("name");
            String pictureUrl = (String) payload.get("picture");
            String googleId = payload.getSubject();

            Account account = accountRepository.findByEmail(email).orElseGet(() -> {
                Role userRole = roleService.getByType(RoleType.USER).orElseThrow();
                Account newAccount = Account.builder()
                        .email(email)
                        .username(email.split("@")[0] + "_" + System.currentTimeMillis())
                        .fullName(fullName)
                        .avatar(pictureUrl)
                        .provider(AuthProvider.GOOGLE)
                        .providerId(googleId)
                        .password(passwordService.encryptPassword(java.util.UUID.randomUUID().toString()))
                        .isActive(true)
                        .roles(java.util.Set.of(userRole))
                        .build();
                return accountRepository.save(newAccount);
            });

            if (!account.isActive()) {
                throw new AppException(ErrorCode.ACCOUNT_LOCKED);
            }

            Set<String> roleNames = account.getRoles().stream()
                    .map(role -> role.getName().name())
                    .collect(Collectors.toSet());

            String accessToken = jwtService.generateToken(account.getId(), account.getEmail(), roleNames);
            String refreshToken = refreshTokenService.generateRefreshToken(account);

            return AuthenticationDTO.builder()
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .account(accountMapper.toDTO(account))
                    .build();

        } catch (Exception e) {
            log.error("Google login error: {}", e.getMessage());
            throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION, e.getMessage());
        }
    }

    @Override
    public Account findByUsername(String username) {
        return accountRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND, "Account"));
    }

    @Override
    public boolean existsByUsername(String username) {
        return accountRepository.existsByUsername(username);
    }
}