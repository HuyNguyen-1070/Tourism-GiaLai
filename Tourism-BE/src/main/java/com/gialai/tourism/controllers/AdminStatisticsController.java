package com.gialai.tourism.controllers;

import com.gialai.tourism.common.base.ApiResponse;
import com.gialai.tourism.models.dto.response.*;
import com.gialai.tourism.services.AdminStatisticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/statistics")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ADMIN')")
public class AdminStatisticsController {

    private final AdminStatisticsService statisticsService;

    @GetMapping("/overview")
    public ApiResponse getOverview() {
        OverviewStatsResponse data = statisticsService.getOverview();
        return new ApiResponse(200, "OK", "Dashboard overview fetched successfully", data);
    }

    @GetMapping("/posts-activity")
    public ApiResponse getPostsActivity(@RequestParam(defaultValue = "5") int month,
                                        @RequestParam(defaultValue = "2026") int year) {
        PostActivityResponse data = statisticsService.getPostActivity(month, year);
        return new ApiResponse(200, "OK", "Post activity statistics fetched successfully", data);
    }

    @GetMapping("/trending-tags")
    public ApiResponse getTrendingTags(@RequestParam(defaultValue = "WEEK") String period,
                                       @RequestParam(defaultValue = "10") int limit) {
        TrendingTagsWrapper wrapper = statisticsService.getTrendingTags(period.toUpperCase(), limit);
        return new ApiResponse(200, "OK", "Trending tags statistics fetched successfully", wrapper);
    }

    @GetMapping("/post-engagement")
    public ApiResponse getPostEngagement(@RequestParam(defaultValue = "WEEK") String period,
                                         @RequestParam(required = false) List<String> tags,
                                         @RequestParam(defaultValue = "10") int limit) {
        PostEngagementWrapper wrapper = statisticsService.getPostEngagement(period.toUpperCase(), tags, limit);
        return new ApiResponse(200, "OK", "Post engagement statistics fetched successfully", wrapper);
    }
}