package com.gialai.tourism.controllers;

import com.gialai.tourism.common.base.ApiResponse;
import com.gialai.tourism.models.dto.response.NotificationResponse;
import com.gialai.tourism.models.dto.response.PageResponse;
import com.gialai.tourism.services.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
@Tag(name = "Notification", description = "User notification APIs")
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping("/me")
    @Operation(summary = "Get my notifications", security = @SecurityRequirement(name = "JWT"))
    public ApiResponse getMyNotifications(@RequestParam(defaultValue = "0") int page,
                                          @RequestParam(defaultValue = "20") int size,
                                          @RequestParam(required = false) Boolean isRead,
                                          @AuthenticationPrincipal UserDetails userDetails) {
        PageResponse<NotificationResponse> pageResponse = notificationService.getUserNotifications(
                userDetails.getUsername(), page, size, isRead);
        return buildResponse(HttpStatus.OK, "Success", pageResponse);
    }

    @PatchMapping("/{notifId}/read")
    @Operation(summary = "Mark notification as read", security = @SecurityRequirement(name = "JWT"))
    public ApiResponse markAsRead(@PathVariable String notifId,
                                  @AuthenticationPrincipal UserDetails userDetails) {
        notificationService.markAsRead(notifId, userDetails.getUsername());
        return buildResponse(HttpStatus.OK, "Notification marked as read", null);
    }

    private ApiResponse buildResponse(HttpStatus status, String message, Object data) {
        ApiResponse response = new ApiResponse();
        response.setCode(status.value());
        response.setStatus(status.getReasonPhrase());
        response.setMessage(message);
        response.setData(data);
        return response;
    }
}