package com.gialai.tourism.models.dto.response;

import lombok.Builder;
import lombok.Data;

@Data @Builder
public class TrendingTagResponse {
    private int rank;
    private String tagId;
    private String tagName;
    private long postCount;
    private long totalLikes;
    private long totalFavorites;
    private double avgRating;
    private double tagScore;
}
