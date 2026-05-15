package com.gialai.tourism.models.dto.response;

import com.gialai.tourism.enums.PostStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor @AllArgsConstructor
public class PostSummaryResponse {
    private String id;
    private String title;
    private String summary;
    private String thumbnail;
    private List<String> tags;
    private String authorUsername;
    private PostStatus status;
    private long viewCount;
    private long likeCount;
    private long favoriteCount;
    private double averageRating;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime favoritedAt;
}