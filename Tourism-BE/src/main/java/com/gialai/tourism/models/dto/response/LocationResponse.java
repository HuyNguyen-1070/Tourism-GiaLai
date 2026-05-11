package com.gialai.tourism.models.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data @Builder
public class LocationResponse {
    private String locationId;
    private String postId;
    private String name;
    private String address;
    private double latitude;
    private double longitude;
    private String placeId;
    private LocalDateTime createdAt;
}