package com.gialai.tourism.services;

import com.gialai.tourism.models.dto.request.CommentRequest;
import com.gialai.tourism.models.dto.request.RatingRequest;
import com.gialai.tourism.models.dto.response.*;

public interface PostInteractionService {
    LikeResponse toggleLike(String postId, String username);
    FavoriteResponse toggleFavorite(String postId, String username);
    PageResponse<PostSummaryResponse> getUserFavorites(String username, int page, int size, String keyword);
    PageResponse<CommentResponse> getComments(String postId, int page, int size);
    CommentResponse addComment(String postId, String username, CommentRequest request);
    CommentResponse updateComment(String commentId, String username, CommentRequest request);
    void deleteComment(String commentId, String username);
    RatingResponse upsertRating(String postId, String username, RatingRequest request);
    RatingResponse getMyRating(String postId, String username);
    InteractionStatusResponse getInteractionStatus(String postId, String username);
}