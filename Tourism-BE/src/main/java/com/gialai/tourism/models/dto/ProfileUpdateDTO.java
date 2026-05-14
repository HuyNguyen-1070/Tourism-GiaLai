package com.gialai.tourism.models.dto;

import com.gialai.tourism.common.constants.Constant;
import com.gialai.tourism.common.constants.MessageConstant;
import com.gialai.tourism.validators.annotations.NotBlankOrEmptyOptional;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfileUpdateDTO {

    @Pattern(regexp = Constant.FULL_NAME_REGEX, message = MessageConstant.INVALID_FULL_NAME)
    private String fullName;

    @Pattern(regexp = Constant.PHONE_REGEX, message = MessageConstant.INVALID_PHONE)
    private String phone;

    @NotBlankOrEmptyOptional(fieldName = "Address")
    @Size(max = 255, message = MessageConstant.ADDRESS_MAX_LENGTH)
    private String address;
}