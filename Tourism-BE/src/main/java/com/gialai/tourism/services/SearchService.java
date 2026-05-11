package com.gialai.tourism.services;

import com.gialai.tourism.models.dto.response.PageResponse;
import com.gialai.tourism.models.dto.response.SearchPostResponse;

import java.time.LocalDateTime;
import java.util.List;

public interface SearchService {
    PageResponse<SearchPostResponse> search(String keyword, List<String> tags,
                                            LocalDateTime fromDate, LocalDateTime toDate,
                                            String sortField, String direction,
                                            int page, int size);
}