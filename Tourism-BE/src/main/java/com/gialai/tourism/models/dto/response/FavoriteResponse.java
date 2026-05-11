package com.gialai.tourism.models.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class FavoriteResponse {
    private String postId;
    private boolean favorited;
    private long favoriteCount;
}