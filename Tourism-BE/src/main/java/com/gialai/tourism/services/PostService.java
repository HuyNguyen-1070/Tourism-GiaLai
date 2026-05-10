package com.gialai.tourism.services;

import com.gialai.tourism.models.dto.request.CreatePostRequest;
import com.gialai.tourism.models.dto.request.UpdatePostRequest;
import com.gialai.tourism.models.dto.response.PageResponse;
import com.gialai.tourism.models.dto.response.PostResponse;
import com.gialai.tourism.models.dto.response.PostSummaryResponse;
import com.gialai.tourism.models.entities.Post;

public interface PostService {
    PostResponse createPost(CreatePostRequest request, String username);
    PostResponse updatePost(String postId, UpdatePostRequest request, String username);
    void deletePost(String postId, String username);
    PageResponse<PostSummaryResponse> getMyPosts(String username, int page, int size, String statusFilter);
    PostResponse getPostDetail(String postId, String username);
    Post findPostById(String postId);
}
