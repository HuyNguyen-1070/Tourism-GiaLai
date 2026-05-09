package com.gialai.tourism.controllers;

import com.gialai.tourism.common.base.ApiResponse;
import com.gialai.tourism.common.constants.MessageConstant;
import com.gialai.tourism.models.dto.auth.ChangePasswordDTO;
import com.gialai.tourism.services.AccountService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;


import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.security.Principal;

@RestController
@RequestMapping("/accounts")
@RequiredArgsConstructor
@Tag(name = "Account", description = "APIs to handle account features")
public class AccountController {
    private final AccountService accountService;

    @PostMapping("/change-password/request-otp")
    @Operation(summary = "Request Change Password OTP", description = "Send OTP to user's email for changing password")
    public ApiResponse requestChangePasswordOtp(@AuthenticationPrincipal UserDetails userDetails) {
        accountService.requestChangePasswordOtp(userDetails.getUsername());
        ApiResponse apiResponse = new ApiResponse();
        apiResponse.setCode(HttpStatus.OK.value());
        apiResponse.setStatus(HttpStatus.OK.getReasonPhrase());
        apiResponse.setMessage(MessageConstant.RESEND_OTP_SUCCESS);
        return apiResponse;
    }

    @PatchMapping("/change-password")
    @Operation(summary = "Change Password", description = "API allows authenticated user to change their own password with OTP verification")
    public ApiResponse changePassword(
            @Valid @RequestBody ChangePasswordDTO changePasswordDTO,
            @AuthenticationPrincipal UserDetails userDetails) {
        accountService.changePassword(changePasswordDTO, userDetails.getUsername());
        ApiResponse apiResponse = new ApiResponse();
        apiResponse.setCode(HttpStatus.OK.value());
        apiResponse.setStatus(HttpStatus.OK.getReasonPhrase());
        apiResponse.setMessage(MessageConstant.UPDATE_PASSWORD_SUCCESS);
        return apiResponse;
    }

    @DeleteMapping()
    @Operation(
            summary = "Deactivate current user account",
            description = "Deactivate the current authenticated account and revoke its refresh token.",
            security = @SecurityRequirement(name = "JWT")
    )
    public ApiResponse delete(Principal principal) {
        accountService.delete(principal.getName());
        ApiResponse apiResponse = new ApiResponse();
        apiResponse.setCode(HttpStatus.OK.value());
        apiResponse.setStatus(HttpStatus.OK.getReasonPhrase());
        apiResponse.setMessage(MessageConstant.DELETED_ACCOUNT_SUCCESS);
        return apiResponse;
    }
}
