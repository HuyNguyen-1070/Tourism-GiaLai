package com.gialai.tourism.services;

import com.gialai.tourism.models.dto.response.AttractionResponse;
import com.gialai.tourism.models.dto.response.PageResponse;
import com.gialai.tourism.models.dto.response.PostResponse;

import java.util.List;

public interface AttractionService {
    PageResponse<AttractionResponse> getAttractions(int page, int size, List<String> tags,
                                                    String keyword, String sort);
    PostResponse getAttractionDetail(String postId);
}