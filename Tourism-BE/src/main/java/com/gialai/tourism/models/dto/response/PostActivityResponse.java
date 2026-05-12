package com.gialai.tourism.models.dto.response;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data @Builder
public class PostActivityResponse {
    private int month;
    private int year;
    private long totalNew;
    private long totalUpdated;
    private List<DailyActivity> daily;

    @Data @Builder
    public static class DailyActivity {
        private String date;
        private long newPosts;
        private long updatedPosts;
    }
}