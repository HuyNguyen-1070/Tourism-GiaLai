package com.gialai.tourism.controllers;

import com.gialai.tourism.common.base.ApiResponse;
import com.gialai.tourism.common.constants.MessageConstant;
import com.gialai.tourism.models.dto.ProfileDTO;
import com.gialai.tourism.models.dto.ProfileUpdateDTO;
import com.gialai.tourism.services.ProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/profile")
@RequiredArgsConstructor
@Tag(name = "Profile Management", description = "APIs for user profile management")
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping("/me")
    @Operation(summary = "Get my profile")
    public ApiResponse getMyProfile(Principal principal) {
        ProfileDTO profile = profileService.getMyProfile(principal.getName());
        return buildSuccessResponse(HttpStatus.OK, "Profile retrieved successfully", profile);
    }

    @PatchMapping("/me")
    @Operation(summary = "Update my profile (partial update)")
    public ApiResponse updateMyProfile(@Valid @RequestBody ProfileUpdateDTO dto, Principal principal) {
        ProfileDTO updated = profileService.updateMyProfile(principal.getName(), dto);
        return buildSuccessResponse(HttpStatus.OK, MessageConstant.UPDATE_PROFILE_SUCCESS, updated);
    }

    @PatchMapping(value = "/me/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Update my avatar")
    public ApiResponse updateAvatar(@RequestPart("avatarFile") MultipartFile avatarFile, Principal principal) {
        String newAvatarUrl = profileService.updateAvatar(principal.getName(), avatarFile);
        return buildSuccessResponse(HttpStatus.OK, MessageConstant.UPDATE_AVATAR_SUCCESS, Map.of("avatar", newAvatarUrl));
    }

    private ApiResponse buildSuccessResponse(HttpStatus status, String message, Object data) {
        ApiResponse response = new ApiResponse();
        response.setCode(status.value());
        response.setStatus(status.getReasonPhrase());
        response.setMessage(message);
        response.setData(data);
        return response;
    }
}