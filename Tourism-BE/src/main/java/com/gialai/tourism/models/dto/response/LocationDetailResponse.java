package com.gialai.tourism.models.dto.response;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data @Builder
public class LocationDetailResponse {
    private String locationId;
    private String name;
    private String address;
    private double latitude;
    private double longitude;
    private String placeId;
    private PostInLocation post;
}