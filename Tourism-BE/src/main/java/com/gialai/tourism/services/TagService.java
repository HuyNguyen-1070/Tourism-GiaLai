package com.gialai.tourism.services;

import com.gialai.tourism.models.dto.response.TagResponse;
import java.util.List;

public interface TagService {
    List<TagResponse> getAllTags();
}