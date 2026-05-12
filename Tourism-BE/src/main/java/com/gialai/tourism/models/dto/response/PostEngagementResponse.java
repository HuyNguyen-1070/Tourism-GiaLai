package com.gialai.tourism.models.dto.response;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data @Builder
public class PostEngagementResponse {
    private int rank;
    private String postId;
    private String title;
    private List<String> tags;
    private String authorUsername;
    private long viewCount;
    private long likeCount;
    private long favoriteCount;
    private double averageRating;
    private long engagementScore;
}