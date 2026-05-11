package com.gialai.tourism.services;

import com.gialai.tourism.models.dto.response.AllLocationResponse;
import com.gialai.tourism.models.dto.response.LocationDetailResponse;
import com.gialai.tourism.models.dto.response.NearbyLocationResponse;

import java.util.List;

public interface MapService {
    NearbyLocationResponse getNearbyLocations(double lat, double lng, int radius, int limit, List<String> tags);
    AllLocationResponse getAllLocations(List<String> tags, String keyword);
    LocationDetailResponse getLocationDetail(String locationId);
}