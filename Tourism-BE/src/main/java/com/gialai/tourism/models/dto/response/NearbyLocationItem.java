package com.gialai.tourism.models.dto.response;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data @Builder
public class NearbyLocationItem {
    private String locationId;
    private String postId;
    private String postTitle;
    private String postThumbnailUrl;
    private String name;
    private String address;
    private double latitude;
    private double longitude;
    private String placeId;
    private double distance;
    private List<String> tags;
    private double averageRating;
    private long likeCount;
}