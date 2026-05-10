package com.gialai.tourism.controllers;

import com.gialai.tourism.common.base.ApiResponse;
import com.gialai.tourism.models.dto.request.RejectPostRequest;
import com.gialai.tourism.models.dto.response.PageResponse;
import com.gialai.tourism.models.dto.response.PostResponse;
import com.gialai.tourism.models.dto.response.PostSummaryResponse;
import com.gialai.tourism.services.AdminPostService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/admin/posts")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin Post", description = "Admin post management APIs")
public class AdminPostController {

    private final AdminPostService adminPostService;

    @GetMapping
    @Operation(summary = "Get posts with filters", security = @SecurityRequirement(name = "JWT"))
    public ApiResponse getPosts(@RequestParam(defaultValue = "0") int page,
                                @RequestParam(defaultValue = "10") int size,
                                @RequestParam(defaultValue = "PENDING") String status,
                                @RequestParam(required = false) List<String> tags,
                                @RequestParam(required = false) String keyword,
                                @RequestParam(required = false) String authorId,
                                @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
                                @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to,
                                @RequestParam(defaultValue = "asc") String sort) {
        PageResponse<PostSummaryResponse> pageResponse = adminPostService.getPosts(status, tags, keyword,
                authorId, from, to, page, size, sort);
        return buildResponse(HttpStatus.OK, "Success", pageResponse);
    }

    @PatchMapping("/{postId}/approve")
    @Operation(summary = "Approve post", security = @SecurityRequirement(name = "JWT"))
    public ApiResponse approvePost(@PathVariable String postId,
                                   @AuthenticationPrincipal UserDetails userDetails) {
        PostResponse response = adminPostService.approvePost(postId, userDetails.getUsername());
        return buildResponse(HttpStatus.OK, "Post approved successfully", response);
    }

    @PatchMapping("/{postId}/reject")
    @Operation(summary = "Reject post", security = @SecurityRequirement(name = "JWT"))
    public ApiResponse rejectPost(@PathVariable String postId,
                                  @Valid @RequestBody RejectPostRequest request,
                                  @AuthenticationPrincipal UserDetails userDetails) {
        PostResponse response = adminPostService.rejectPost(postId, request.getReason(), userDetails.getUsername());
        return buildResponse(HttpStatus.OK, "Post rejected successfully", response);
    }

    @DeleteMapping("/{postId}")
    @Operation(summary = "Admin delete post", security = @SecurityRequirement(name = "JWT"))
    public ApiResponse deletePost(@PathVariable String postId) {
        adminPostService.deletePost(postId);
        return buildResponse(HttpStatus.NO_CONTENT, "Post deleted successfully", null);
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