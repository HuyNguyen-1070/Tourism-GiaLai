package com.gialai.tourism.models.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class RatingResponse {
    private String postId;
    private Double myScore;
    private double averageRating;
    private int ratingCount;
}