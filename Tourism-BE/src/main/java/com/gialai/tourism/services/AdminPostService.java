package com.gialai.tourism.services;

import com.gialai.tourism.models.dto.response.PageResponse;
import com.gialai.tourism.models.dto.response.PostResponse;
import com.gialai.tourism.models.dto.response.PostSummaryResponse;

import java.time.LocalDateTime;
import java.util.List;

public interface AdminPostService {
    PageResponse<PostSummaryResponse> getPosts(String status, List<String> tags, String keyword,
                                               String authorId, LocalDateTime from, LocalDateTime to,
                                               int page, int size, String sortDir);
    PostResponse approvePost(String postId, String adminUsername);
    PostResponse rejectPost(String postId, String reason, String adminUsername);
    void deletePost(String postId);
}