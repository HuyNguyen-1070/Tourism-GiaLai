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
public class AttractionResponse {
    private String id;
    private String title;
    private String summary;
    private List<String> tags;
    private List<String> images;
    private String sourceType;
    private String authorUsername;
    private String sourceName;
    private String status;
    private Double latitude;
    private Double longitude;
    private long viewCount;
    private long likeCount;
    private long favoriteCount;
    private double averageRating;
    private long engagementScore;
    private LocalDateTime createdAt;
}