package com.gialai.tourism.controllers;

import com.gialai.tourism.common.base.ApiResponse;
import com.gialai.tourism.services.HomepageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/homepage")
@RequiredArgsConstructor
public class HomepageController {

    private final HomepageService homepageService;

    @GetMapping("/featured-posts")
    public ApiResponse getFeaturedPosts() {
        return buildResponse(HttpStatus.OK, "Featured posts fetched successfully",
                homepageService.getFeaturedPosts());
    }

    @GetMapping("/attractive-locations")
    public ApiResponse getAttractiveLocations() {
        return buildResponse(HttpStatus.OK, "Attractive locations fetched successfully",
                homepageService.getAttractiveLocations());
    }

    @GetMapping("/cultural-events")
    public ApiResponse getCulturalEvents() {
        return buildResponse(HttpStatus.OK, "Cultural events fetched successfully",
                homepageService.getCulturalEvents());
    }

    private ApiResponse buildResponse(HttpStatus status, String message, Object data) {
        ApiResponse response = new ApiResponse();
        response.setCode(status.value());
        response.setStatus(status.getReasonPhrase());
        response.setMessage(message);
        response.setData(data);
        return response;
    }
}