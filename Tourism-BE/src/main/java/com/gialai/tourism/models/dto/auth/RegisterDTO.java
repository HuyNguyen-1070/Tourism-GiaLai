package com.gialai.tourism.models.dto.auth;

import com.gialai.tourism.common.constants.Constant;
import com.gialai.tourism.common.constants.MessageConstant;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterDTO {
    @NotBlank(message = "Full name is required")
    @Size(max = 100, message = "Full name must be at most 100 characters")
    private String fullName;

    @NotBlank(message = "Username is required")
    @Size(min = 4, max = 30, message = "Username must be between 4 and 30 characters")
    @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "Username can only contain letters, numbers and underscores")
    private String username;

    @Pattern(regexp = Constant.EMAIL_REGEX, message = MessageConstant.INVALID_EMAIL)
    private String email;

    @Pattern(regexp = Constant.PASSWORD_REGEX, message = MessageConstant.INVALID_PASSWORD)
    private String password;

    @NotBlank(message = "Confirm password is required")
    private String confirmPassword;
}
