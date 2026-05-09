package com.gialai.tourism.models.dto.auth;

import com.gialai.tourism.common.constants.Constant;
import com.gialai.tourism.common.constants.MessageConstant;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class UpdatePasswordDTO {
    @Pattern(regexp = Constant.PASSWORD_REGEX, message = MessageConstant.INVALID_PASSWORD)
    private String newPassword;
    private String email;
}