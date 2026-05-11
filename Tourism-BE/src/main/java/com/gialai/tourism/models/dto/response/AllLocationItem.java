package com.gialai.tourism.models.dto.response;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data @Builder
public class AllLocationItem {
    private String locationId;
    private String postId;
    private String postTitle;
    private String name;
    private String address;
    private double latitude;
    private double longitude;
    private String placeId;
    private String thumbnailUrl;
    private List<String> tags;
    private double averageRating;
}