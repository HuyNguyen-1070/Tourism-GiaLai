package com.gialai.tourism.controllers;

import com.gialai.tourism.common.base.ApiResponse;
import com.gialai.tourism.services.HistoryTimelineService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/history-timeline")
@RequiredArgsConstructor
public class HistoryTimelineController {

    private final HistoryTimelineService historyTimelineService;

    @GetMapping
    public ApiResponse getAll() {
        return buildResponse(HttpStatus.OK, "History timeline fetched successfully",
                historyTimelineService.getAll());
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