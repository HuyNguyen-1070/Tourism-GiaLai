package com.gialai.tourism.models.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data @Builder
public class TagWithCountResponse {
    private String id;
    private String name;
    private int postCount;
    private LocalDateTime createdAt;
}