package com.gialai.tourism.controllers;

import com.gialai.tourism.common.base.ApiResponse;
import com.gialai.tourism.models.dto.request.CreatePostRequest;
import com.gialai.tourism.models.dto.request.UpdatePostRequest;
import com.gialai.tourism.models.dto.response.PageResponse;
import com.gialai.tourism.models.dto.response.PostResponse;
import com.gialai.tourism.models.dto.response.PostSummaryResponse;
import com.gialai.tourism.services.PostService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Optional;

@RestController
@RequestMapping("/posts")
@RequiredArgsConstructor
@Tag(name = "Post", description = "APIs for user post management")
public class PostController {

    private final PostService postService;

    @PostMapping
    @Operation(summary = "Create new post", security = @SecurityRequirement(name = "JWT"))
    public ApiResponse createPost(@Valid @RequestBody CreatePostRequest request,
                                  @AuthenticationPrincipal UserDetails userDetails) {
        PostResponse response = postService.createPost(request, userDetails.getUsername());
        return buildResponse(HttpStatus.CREATED, "Post created successfully", response);
    }

    @PutMapping("/{postId}")
    @Operation(summary = "Update post", security = @SecurityRequirement(name = "JWT"))
    public ApiResponse updatePost(@PathVariable String postId,
                                  @Valid @RequestBody UpdatePostRequest request,
                                  @AuthenticationPrincipal UserDetails userDetails) {
        PostResponse response = postService.updatePost(postId, request, userDetails.getUsername());
        return buildResponse(HttpStatus.OK, "Post updated successfully", response);
    }

    @DeleteMapping("/{postId}")
    @Operation(summary = "Delete post (soft delete)", security = @SecurityRequirement(name = "JWT"))
    public ApiResponse deletePost(@PathVariable String postId,
                                  @AuthenticationPrincipal UserDetails userDetails) {
        postService.deletePost(postId, userDetails.getUsername());
        return buildResponse(HttpStatus.NO_CONTENT, "Post deleted successfully", null);
    }

    @GetMapping("/me")
    @Operation(summary = "Get my posts", security = @SecurityRequirement(name = "JWT"))
    public ApiResponse getMyPosts(@RequestParam(defaultValue = "0") int page,
                                  @RequestParam(defaultValue = "10") int size,
                                  @RequestParam(required = false) String status,
                                  @AuthenticationPrincipal UserDetails userDetails) {
        PageResponse<PostSummaryResponse> pageResponse = postService.getMyPosts(userDetails.getUsername(), page, size, status);
        return buildResponse(HttpStatus.OK, "Success", pageResponse);
    }

    @GetMapping("/{postId}")
    @Operation(summary = "Get post detail (public if APPROVED)")
    public ApiResponse getPostDetail(@PathVariable String postId, Principal principal) {
        String username = (principal != null) ? principal.getName() : null;
        PostResponse response = postService.getPostDetail(postId, username);
        return buildResponse(HttpStatus.OK, "Success", response);
    }

    private ApiResponse buildResponse(HttpStatus status, String message, Object data) {
        ApiResponse response = new ApiResponse();
        response.setCode(status.value());
        response.setStatus(status.getReasonPhrase());
        response.setMessage(message);
        response.setData(data);
        return response;
    }
}