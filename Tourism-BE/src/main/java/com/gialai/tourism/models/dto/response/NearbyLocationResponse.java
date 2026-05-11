package com.gialai.tourism.models.dto.response;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data @Builder
public class NearbyLocationResponse {
    private LatLng userLocation;
    private int radius;
    private int totalFound;
    private List<NearbyLocationItem> locations;
}