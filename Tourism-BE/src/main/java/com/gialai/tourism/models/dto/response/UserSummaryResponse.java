package com.gialai.tourism.models.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.Set;

@Data @Builder
public class UserSummaryResponse {
    private String id;
    private String fullName;
    private String username;
    private String email;
    private String avatar;
    private String provider;
    @JsonProperty("isActive")
    private boolean isActive;
    private Set<String> roles;
    private int postCount;
    private LocalDateTime createdAt;
}