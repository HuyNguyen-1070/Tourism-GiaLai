package com.gialai.tourism.services;

import com.gialai.tourism.enums.RoleType;
import com.gialai.tourism.models.dto.auth.*;
import com.gialai.tourism.models.entities.Account;

public interface AccountService {
    void forgotPassword(ForgotPasswordDTO forgotPasswordDTO);
    void verifyOtp(OtpVerificationDTO otpVerificationDTO);
    void updatePassword(UpdatePasswordDTO updatePasswordDTO);
    Account findByEmail(String email);
    Account findByUsername(String username);
    AuthenticationDTO login(LoginDTO loginDTO);
    void register(RegisterDTO registerDTO);
    void verifyRegistrationByOtp(OtpVerificationDTO otpVerificationDTO);
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByRole(RoleType roleType);
    void save(Account account);
    void logout(String refreshToken);
    void requestChangePasswordOtp(String email);
    void changePassword(ChangePasswordDTO changePasswordDTO, String email);
    void delete(String email);
}