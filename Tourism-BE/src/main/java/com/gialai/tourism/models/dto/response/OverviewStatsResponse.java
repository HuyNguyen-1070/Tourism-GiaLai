package com.gialai.tourism.models.dto.response;

import lombok.Builder;
import lombok.Data;

@Data @Builder
public class OverviewStatsResponse {
    private long totalPosts;
    private long pendingPosts;
    private long approvedPosts;
    private long rejectedPosts;
    private long totalUsers;
    private long newUsersLast30Days;
    private long totalTags;
    private long totalLocations;
    private long totalComments;
    private long totalLikes;
}