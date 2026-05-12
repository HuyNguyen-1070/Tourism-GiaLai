package com.gialai.tourism.models.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.Set;

@Data @Builder
public class UserDetailResponse {
    private String id;
    private String fullName;
    private String username;
    private String email;
    private String avatar;
    private String provider;
    private boolean isActive;
    private Set<String> roles;
    private UserStats stats;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data @Builder
    public static class UserStats {
        private int totalPosts;
        private int approvedPosts;
        private int pendingPosts;
        private int rejectedPosts;
    }
}