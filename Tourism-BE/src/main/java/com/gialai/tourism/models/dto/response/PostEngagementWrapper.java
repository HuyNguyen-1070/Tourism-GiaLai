package com.gialai.tourism.models.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data @Builder
public class PostEngagementWrapper {
    private String period;
    private LocalDateTime from;
    private LocalDateTime to;
    private List<PostEngagementResponse> posts;
}