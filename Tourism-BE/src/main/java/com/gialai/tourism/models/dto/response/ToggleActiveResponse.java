package com.gialai.tourism.models.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data @Builder
public class ToggleActiveResponse {
    private String userId;
    private String username;
    private boolean isActive;
    private LocalDateTime updatedAt;
}