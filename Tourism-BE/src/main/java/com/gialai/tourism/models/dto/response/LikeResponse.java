package com.gialai.tourism.models.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LikeResponse {
    private String postId;
    private boolean liked;
    private long likeCount;
}