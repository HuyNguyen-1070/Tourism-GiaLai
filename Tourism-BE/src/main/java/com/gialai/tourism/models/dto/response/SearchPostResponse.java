package com.gialai.tourism.models.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class SearchPostResponse {
    private String id;
    private String title;
    private String summary;
    private List<String> tags;
    private String thumbnailUrl;
    private String sourceType;
    private String authorUsername;
    private String sourceName;
    private long viewCount;
    private long likeCount;
    private long favoriteCount;
    private double averageRating;
    private LocalDateTime createdAt;
}