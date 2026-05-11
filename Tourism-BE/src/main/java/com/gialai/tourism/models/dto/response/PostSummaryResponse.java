package com.gialai.tourism.models.dto.response;

import com.gialai.tourism.enums.PostStatus;
import com.gialai.tourism.enums.PostTag;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class PostSummaryResponse {
    private String id;
    private String title;
    private String summary;
    private List<PostTag> tags;
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