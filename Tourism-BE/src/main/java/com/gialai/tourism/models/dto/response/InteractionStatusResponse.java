package com.gialai.tourism.models.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class InteractionStatusResponse {
    private String postId;
    private boolean liked;
    private boolean favorited;
    private Double myScore;
    private long likeCount;
    private long favoriteCount;
    private double averageRating;
    private int ratingCount;
}