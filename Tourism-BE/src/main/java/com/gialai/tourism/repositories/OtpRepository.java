package com.gialai.tourism.repositories;

import com.gialai.tourism.models.Entities.Otp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface OtpRepository extends JpaRepository<Otp, Long> {
    Optional<Otp> findByEmailAndOtpCodeAndUsedFalse(String email, String otpCode);
    void deleteByExpiryDateBefore(LocalDateTime now);
}