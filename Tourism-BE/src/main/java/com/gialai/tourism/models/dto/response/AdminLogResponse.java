package com.gialai.tourism.models.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data @Builder
public class AdminLogResponse {
    private String id;
    private String adminId;
    private String adminUsername;
    private String action;
    private String targetId;
    private String targetType;
    private String detail;
    private LocalDateTime createdAt;
}