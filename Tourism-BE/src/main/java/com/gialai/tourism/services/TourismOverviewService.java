package com.gialai.tourism.services;

import com.gialai.tourism.models.dto.request.TourismOverviewRequest;
import com.gialai.tourism.models.dto.response.TourismOverviewResponse;

public interface TourismOverviewService {
    TourismOverviewResponse get();
    TourismOverviewResponse update(TourismOverviewRequest request, String username);
}