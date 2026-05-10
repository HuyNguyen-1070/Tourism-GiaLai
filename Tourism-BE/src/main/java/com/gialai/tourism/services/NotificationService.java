package com.gialai.tourism.services;

import com.gialai.tourism.enums.NotificationType;
import com.gialai.tourism.models.dto.response.NotificationResponse;
import com.gialai.tourism.models.dto.response.PageResponse;

public interface NotificationService {
    void notifyAdmins(String message, String postId, NotificationType type);
    void notifyUser(String email, String message, String postId, NotificationType type);
    PageResponse<NotificationResponse> getUserNotifications(String username, int page, int size, Boolean isRead);
    void markAsRead(String notificationId, String username);
}