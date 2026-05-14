package com.gialai.tourism.controllers;

import com.gialai.tourism.common.base.ApiResponse;
import com.gialai.tourism.enums.ErrorCode;
import com.gialai.tourism.exceptions.AppException;
import com.gialai.tourism.models.dto.response.PageResponse;
import com.gialai.tourism.models.dto.response.SearchPostResponse;
import com.gialai.tourism.services.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/posts")
@RequiredArgsConstructor
public class SearchController {

    private final SearchService searchService;

    @GetMapping("/search")
    public ResponseEntity<ApiResponse> search(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) List<String> tags,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime toDate,
            @RequestParam(defaultValue = "createdAt") String sort,
            @RequestParam(defaultValue = "desc") String direction,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {

        // Validate keyword length
        if (keyword != null && keyword.trim().length() > 200) {
            throw new AppException(ErrorCode.VALIDATION_ERROR, "Keyword must not exceed 200 characters");
        }

        // Validate date range
        if (fromDate != null && toDate != null && fromDate.isAfter(toDate)) {
            throw new AppException(ErrorCode.VALIDATION_ERROR, "fromDate must be before or equal to toDate");
        }

        // Deduplicate tags
        List<String> uniqueTags = tags != null
                ? tags.stream().distinct().collect(Collectors.toList())
                : null;

        // Clamp size
        if (size > 50) size = 50;

        PageResponse<SearchPostResponse> result = searchService.search(
                keyword, uniqueTags, fromDate, toDate, sort, direction, page, size);

        String message = result.getTotalElements() == 0
                ? "No posts found matching your criteria"
                : "Search results fetched successfully";

        return ResponseEntity.ok(new ApiResponse(200, "OK", message, result));
    }
}