package com.gialai.tourism.services;

import com.gialai.tourism.models.dto.response.PageResponse;
import com.gialai.tourism.models.dto.response.PostSummaryResponse;

import java.time.LocalDateTime;
import java.util.List;

public interface EventFestivalService {
    PageResponse<PostSummaryResponse> getEventsFestivals(
            int page, int size,
            List<String> tags,
            String keyword,
            LocalDateTime fromDate,
            LocalDateTime toDate,
            String sort
    );
}