package com.gialai.tourism.services;

import com.gialai.tourism.models.dto.response.*;

import java.util.List;

public interface AdminStatisticsService {
    OverviewStatsResponse getOverview();
    PostActivityResponse getPostActivity(int month, int year);
    TrendingTagsWrapper getTrendingTags(String period, int limit);
    PostEngagementWrapper getPostEngagement(String period, List<String> tags, int limit);
}