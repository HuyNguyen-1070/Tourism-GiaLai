package com.gialai.tourism.controllers;

import com.gialai.tourism.common.base.ApiResponse;
import com.gialai.tourism.models.dto.request.CommentRequest;
import com.gialai.tourism.models.dto.request.RatingRequest;
import com.gialai.tourism.models.dto.response.*;
import com.gialai.tourism.services.PostInteractionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Tag(name = "Post Interaction", description = "Like, favorite, comment, rating APIs")
public class PostInteractionController {

    private final PostInteractionService interactionService;

    @PostMapping("/posts/{postId}/like")
    @Operation(summary = "Like/Unlike a post", security = @SecurityRequirement(name = "JWT"))
    public ApiResponse toggleLike(@PathVariable String postId,
                                  @AuthenticationPrincipal UserDetails userDetails) {
        LikeResponse res = interactionService.toggleLike(postId, userDetails.getUsername());
        String msg = res.isLiked() ? "Post liked successfully" : "Post unliked successfully";
        return buildResponse(HttpStatus.OK, msg, res);
    }

    @PostMapping("/posts/{postId}/favorite")
    @Operation(summary = "Favorite/Unfavorite a post", security = @SecurityRequirement(name = "JWT"))
    public ApiResponse toggleFavorite(@PathVariable String postId,
                                      @AuthenticationPrincipal UserDetails userDetails) {
        FavoriteResponse res = interactionService.toggleFavorite(postId, userDetails.getUsername());
        String msg = res.isFavorited() ? "Post added to favorites" : "Post removed from favorites";
        return buildResponse(HttpStatus.OK, msg, res);
    }

    @GetMapping("/posts/favorites/me")
    @Operation(summary = "Get my favorite posts", security = @SecurityRequirement(name = "JWT"))
    public ApiResponse getMyFavorites(@RequestParam(defaultValue = "0") int page,
                                      @RequestParam(defaultValue = "10") int size,
                                      @RequestParam(required = false) String keyword,
                                      @AuthenticationPrincipal UserDetails userDetails) {
        PageResponse<PostSummaryResponse> data = interactionService.getUserFavorites(userDetails.getUsername(), page, size, keyword);
        return buildResponse(HttpStatus.OK, "Success", data);
    }

    // COMMENTS
    @GetMapping("/posts/{postId}/comments")
    @Operation(summary = "Get comments of a post")
    public ApiResponse getComments(@PathVariable String postId,
                                   @RequestParam(defaultValue = "0") int page,
                                   @RequestParam(defaultValue = "20") int size) {
        PageResponse<CommentResponse> data = interactionService.getComments(postId, page, size);
        return buildResponse(HttpStatus.OK, "Success", data);
    }

    @PostMapping("/posts/{postId}/comments")
    @Operation(summary = "Add a comment", security = @SecurityRequirement(name = "JWT"))
    public ApiResponse addComment(@PathVariable String postId,
                                  @Valid @RequestBody CommentRequest request,
                                  @AuthenticationPrincipal UserDetails userDetails) {
        CommentResponse res = interactionService.addComment(postId, userDetails.getUsername(), request);
        return buildResponse(HttpStatus.CREATED, "Comment added successfully", res);
    }

    @PutMapping("/comments/{commentId}")
    @Operation(summary = "Edit own comment", security = @SecurityRequirement(name = "JWT"))
    public ApiResponse updateComment(@PathVariable String commentId,
                                     @Valid @RequestBody CommentRequest request,
                                     @AuthenticationPrincipal UserDetails userDetails) {
        CommentResponse res = interactionService.updateComment(commentId, userDetails.getUsername(), request);
        return buildResponse(HttpStatus.OK, "Comment updated successfully", res);
    }

    @DeleteMapping("/comments/{commentId}")
    @Operation(summary = "Delete own comment (or admin)", security = @SecurityRequirement(name = "JWT"))
    public ApiResponse deleteComment(@PathVariable String commentId,
                                     @AuthenticationPrincipal UserDetails userDetails) {
        interactionService.deleteComment(commentId, userDetails.getUsername());
        return buildResponse(HttpStatus.NO_CONTENT, "Comment deleted successfully", null);
    }

    // RATING
    @PostMapping("/posts/{postId}/rating")
    @Operation(summary = "Rate a post (upsert)", security = @SecurityRequirement(name = "JWT"))
    public ApiResponse upsertRating(@PathVariable String postId,
                                    @Valid @RequestBody RatingRequest request,
                                    @AuthenticationPrincipal UserDetails userDetails) {
        RatingResponse res = interactionService.upsertRating(postId, userDetails.getUsername(), request);
        return buildResponse(HttpStatus.OK, "Rating submitted successfully", res);
    }

    @GetMapping("/posts/{postId}/rating/me")
    @Operation(summary = "Get my rating for a post", security = @SecurityRequirement(name = "JWT"))
    public ApiResponse getMyRating(@PathVariable String postId,
                                   @AuthenticationPrincipal UserDetails userDetails) {
        RatingResponse res = interactionService.getMyRating(postId, userDetails.getUsername());
        return buildResponse(HttpStatus.OK, "Success", res);
    }

    @GetMapping("/posts/{postId}/interaction-status")
    @Operation(summary = "Get my interaction status with a post", security = @SecurityRequirement(name = "JWT"))
    public ApiResponse getInteractionStatus(@PathVariable String postId,
                                            @AuthenticationPrincipal UserDetails userDetails) {
        InteractionStatusResponse res = interactionService.getInteractionStatus(postId, userDetails.getUsername());
        return buildResponse(HttpStatus.OK, "Success", res);
    }

    // Helper
    private ApiResponse buildResponse(HttpStatus status, String message, Object data) {
        ApiResponse response = new ApiResponse();
        response.setCode(status.value());
        response.setStatus(status.getReasonPhrase());
        response.setMessage(message);
        response.setData(data);
        return response;
    }
}