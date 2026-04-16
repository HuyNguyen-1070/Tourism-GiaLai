package com.gialai.tourism.services.implement;

import com.gialai.tourism.services.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Override
    public void sendOtpEmail(String to, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Gia Lai Tourism - Mã OTP xác thực");
        message.setText("Mã OTP của bạn là: " + otp + "\nMã có hiệu lực trong 5 phút.");
        mailSender.send(message);
    }

    @Override
    public void sendPasswordChangedNotification(String to) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Gia Lai Tourism - Mật khẩu đã được thay đổi");
        message.setText("Mật khẩu tài khoản của bạn vừa được thay đổi thành công.\nNếu không phải bạn, vui lòng liên hệ hỗ trợ.");
        mailSender.send(message);
    }
}