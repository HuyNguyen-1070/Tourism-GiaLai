package com.gialai.tourism.models.dto.auth;

import com.gialai.tourism.common.constants.Constant;
import com.gialai.tourism.common.constants.MessageConstant;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class ChangePasswordDTO {
    @NotBlank(message = "Current password is required")
    private String currentPassword;

    @NotBlank(message = "New password is required")
    @Pattern(regexp = Constant.PASSWORD_REGEX, message = MessageConstant.INVALID_PASSWORD)
    private String newPassword;

    @NotBlank(message = "Confirm password is required")
    private String confirmPassword;

    @NotBlank(message = "OTP is required")
    private String otp;
}
