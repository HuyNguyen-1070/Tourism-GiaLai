package com.gialai.tourism.models.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor @AllArgsConstructor
public class HomepagePostResponse {
    private String id;
    private String title;
    private String summary;
    private List<String> tags;
    private String thumbnail;
    private String sourceType;
    private String authorUsername;
    private String sourceName;
    private long viewCount;
    private long likeCount;
    private long favoriteCount;
    private double averageRating;
    private long engagementScore;
    private LocalDateTime createdAt;
}