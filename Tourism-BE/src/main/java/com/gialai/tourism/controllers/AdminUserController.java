package com.gialai.tourism.controllers;

import com.gialai.tourism.common.base.ApiResponse;
import com.gialai.tourism.models.dto.request.AssignRoleRequest;
import com.gialai.tourism.models.dto.response.*;
import com.gialai.tourism.services.AdminUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ADMIN')")
public class AdminUserController {

    private final AdminUserService adminUserService;

    @GetMapping
    public ApiResponse getUsers(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Boolean isActive,
            @RequestParam(required = false) String role,
            @RequestParam(defaultValue = "createdAt") String sort,
            @RequestParam(defaultValue = "desc") String direction,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        PageResponse<UserSummaryResponse> data = adminUserService.getUsers(keyword, isActive, role, sort, direction, page, size);
        return new ApiResponse(200, "OK", "User list fetched successfully", data);
    }

    @GetMapping("/{userId}")
    public ApiResponse getUserDetail(@PathVariable String userId) {
        UserDetailResponse data = adminUserService.getUserDetail(userId);
        return new ApiResponse(200, "OK", "User detail fetched successfully", data);
    }

    @PatchMapping("/{userId}/toggle-active")
    public ApiResponse toggleActive(@PathVariable String userId,
                                    @AuthenticationPrincipal UserDetails admin) {
        ToggleActiveResponse data = adminUserService.toggleActive(userId, admin.getUsername());
        String message = data.isActive() ? "User account has been unlocked" : "User account has been locked";
        return new ApiResponse(200, "OK", message, data);
    }

    @PatchMapping("/{userId}/role")
    public ApiResponse assignRole(@PathVariable String userId,
                                  @Valid @RequestBody AssignRoleRequest request,
                                  @AuthenticationPrincipal UserDetails admin) {
        UserRolesResponse data = adminUserService.assignRole(userId, request.getRoleName(), request.getAction(), admin.getUsername());
        return new ApiResponse(200, "OK",
                request.getAction() + " role " + request.getRoleName() + " for user " + data.getUsername(),
                data);
    }
}