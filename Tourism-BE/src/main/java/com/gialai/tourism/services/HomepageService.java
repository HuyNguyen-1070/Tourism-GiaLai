package com.gialai.tourism.services;

import com.gialai.tourism.models.dto.response.HomepagePostResponse;

import java.util.List;

public interface HomepageService {
    List<HomepagePostResponse> getFeaturedPosts();
    List<HomepagePostResponse> getAttractiveLocations();
    List<HomepagePostResponse> getCulturalEvents();
}