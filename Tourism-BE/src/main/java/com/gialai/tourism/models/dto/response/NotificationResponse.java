package com.gialai.tourism.models.dto.response;

import com.gialai.tourism.enums.NotificationType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class NotificationResponse {
    private String id;
    private NotificationType type;
    private String message;
    private boolean isRead;
    private String relatedPostId;
    private LocalDateTime createdAt;
}