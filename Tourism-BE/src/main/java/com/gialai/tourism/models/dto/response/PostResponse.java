package com.gialai.tourism.models.dto.response;

import com.gialai.tourism.enums.PostStatus;
import com.gialai.tourism.enums.SourceType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class PostResponse {
    private String id;
    private String title;
    private String content;
    private String summary;
    private List<String> tags;
    private List<String> images;
    private SourceType sourceType;
    private String sourceName;
    private String authorUsername;
    private PostStatus status;
    private long viewCount;
    private long likeCount;
    private long favoriteCount;
    private double averageRating;
    private int ratingCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime approvedAt;
    private LocalDateTime rejectedAt;
    private String approvedByUsername;
    private String rejectedByUsername;
    private String rejectionReason;
}