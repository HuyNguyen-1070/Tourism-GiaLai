package com.gialai.tourism.models.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor @AllArgsConstructor
public class HistoryTimelineResponse {
    private String id;
    private int year;
    private String title;
    private String description;
    private String locationName;
    private String imageUrl;
    private HistoryTimelinePostInfo relatedPost;
    private int displayOrder;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    @Builder
    @NoArgsConstructor @AllArgsConstructor
    public static class HistoryTimelinePostInfo {
        private String id;
        private String title;
        private String thumbnail;
    }
}