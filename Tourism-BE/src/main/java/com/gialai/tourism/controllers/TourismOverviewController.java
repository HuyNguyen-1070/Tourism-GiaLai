package com.gialai.tourism.controllers;

import com.gialai.tourism.common.base.ApiResponse;
import com.gialai.tourism.models.dto.response.TourismOverviewResponse;
import com.gialai.tourism.services.TourismOverviewService;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/tourism-overview")
@RequiredArgsConstructor
public class TourismOverviewController {

    private final TourismOverviewService tourismOverviewService;

    @GetMapping
    public ApiResponse getOverview() {
        TourismOverviewResponse data = tourismOverviewService.get();
        String message = (data != null) ? "Tourism overview fetched successfully" : "No data available";
        return buildResponse(HttpStatus.OK, message, data);
    }

    private ApiResponse buildResponse(@NonNull HttpStatus status, String message, Object data) {
        ApiResponse response = new ApiResponse();
        response.setCode(status.value());
        response.setStatus(status.getReasonPhrase());
        response.setMessage(message);
        response.setData(data);
        return response;
    }
}