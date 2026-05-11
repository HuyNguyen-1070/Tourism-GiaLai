package com.gialai.tourism.controllers;

import com.gialai.tourism.common.base.ApiResponse;
import com.gialai.tourism.services.EventFestivalService;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/events-festivals")
@RequiredArgsConstructor
public class EventFestivalController {

    private final EventFestivalService eventFestivalService;

    @GetMapping
    public ApiResponse getEvents(@RequestParam(defaultValue = "0") int page,
                                 @RequestParam(defaultValue = "12") int size,
                                 @RequestParam(required = false) List<String> tags,
                                 @RequestParam(required = false) String keyword,
                                 @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fromDate,
                                 @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime toDate,
                                 @RequestParam(defaultValue = "createdAt,desc") String sort) {
        return buildResponse(HttpStatus.OK, "Events and festivals fetched successfully",
                eventFestivalService.getEventsFestivals(page, size, tags, keyword, fromDate, toDate, sort));
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