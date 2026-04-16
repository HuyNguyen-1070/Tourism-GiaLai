package com.gialai.tourism.services.implement;

import com.gialai.tourism.models.Entities.Otp;
import com.gialai.tourism.repositories.OtpRepository;
import com.gialai.tourism.services.EmailService;
import com.gialai.tourism.services.OtpService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class OtpServiceImpl implements OtpService {

    private final OtpRepository otpRepository;
    private final EmailService emailService;
    private static final SecureRandom random = new SecureRandom();

    @Override
    public void generateAndSendOtp(String email) {
        String otpCode = String.format("%06d", random.nextInt(1000000));
        Otp otp = Otp.builder()
                .email(email)
                .otpCode(otpCode)
                .expiryDate(LocalDateTime.now().plusMinutes(5))
                .used(false)
                .build();
        otpRepository.save(otp);
        emailService.sendOtpEmail(email, otpCode);
    }

    @Override
    public boolean verifyOtp(String email, String otpCode) {
        return otpRepository.findByEmailAndOtpCodeAndUsedFalse(email, otpCode)
                .map(otp -> {
                    if (otp.getExpiryDate().isAfter(LocalDateTime.now())) {
                        otp.setUsed(true);
                        otpRepository.save(otp);
                        return true;
                    }
                    return false;
                })
                .orElse(false);
    }
}