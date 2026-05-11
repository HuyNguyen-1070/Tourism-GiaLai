package com.gialai.tourism.controllers;

import com.gialai.tourism.common.base.ApiResponse;
import com.gialai.tourism.services.AttractionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/attractions")
@RequiredArgsConstructor
public class AttractionController {

    private final AttractionService attractionService;

    @GetMapping
    public ApiResponse getAttractions(@RequestParam(defaultValue = "0") int page,
                                      @RequestParam(defaultValue = "12") int size,
                                      @RequestParam(required = false) List<String> tags,
                                      @RequestParam(required = false) String keyword,
                                      @RequestParam(defaultValue = "engagementScore,desc") String sort) {
        return buildResponse(HttpStatus.OK, "Attractions fetched successfully",
                attractionService.getAttractions(page, size, tags, keyword, sort));
    }

    @GetMapping("/{postId}")
    public ApiResponse getAttractionDetail(@PathVariable String postId) {
        return buildResponse(HttpStatus.OK, "Attraction detail fetched successfully",
                attractionService.getAttractionDetail(postId));
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