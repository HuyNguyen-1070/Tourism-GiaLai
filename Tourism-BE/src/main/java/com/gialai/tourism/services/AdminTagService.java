package com.gialai.tourism.services;

import com.gialai.tourism.models.dto.request.CreateTagRequest;
import com.gialai.tourism.models.dto.request.UpdateTagRequest;
import com.gialai.tourism.models.dto.response.TagWithCountResponse;

import java.util.List;

public interface AdminTagService {
    List<TagWithCountResponse> getAllTags(String keyword);
    TagWithCountResponse createTag(CreateTagRequest request, String adminId);
    TagWithCountResponse updateTag(String tagId, UpdateTagRequest request, String adminId);
    void deleteTag(String tagId, String adminId);
}