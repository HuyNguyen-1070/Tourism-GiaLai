package com.gialai.tourism.services;

import com.gialai.tourism.models.dto.request.CreateLocationRequest;
import com.gialai.tourism.models.dto.request.UpdateLocationRequest;
import com.gialai.tourism.models.dto.response.LocationResponse;

public interface LocationService {
    LocationResponse createLocation(CreateLocationRequest request);
    LocationResponse updateLocation(String id, UpdateLocationRequest request);
    void deleteLocation(String id);
}