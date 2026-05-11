package com.gialai.tourism.models.dto.response;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data @Builder
public class PostInLocation {
    private String id;
    private String title;
    private String summary;
    private String thumbnailUrl;
    private List<String> images;
    private List<String> tags;
    private String authorUsername;
    private String sourceName;
    private long viewCount;
    private long likeCount;
    private double averageRating;
    private int ratingCount;
}