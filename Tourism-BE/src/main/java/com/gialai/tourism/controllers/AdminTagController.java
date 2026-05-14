package com.gialai.tourism.controllers;

import com.gialai.tourism.common.base.ApiResponse;
import com.gialai.tourism.models.dto.request.CreateTagRequest;
import com.gialai.tourism.models.dto.request.UpdateTagRequest;
import com.gialai.tourism.models.dto.response.TagWithCountResponse;
import com.gialai.tourism.services.AdminTagService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/tags")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ADMIN')")
public class AdminTagController {

    private final AdminTagService adminTagService;

    @GetMapping
    public ApiResponse getAllTags(@RequestParam(required = false) String keyword) {
        List<TagWithCountResponse> tags = adminTagService.getAllTags(keyword);
        return new ApiResponse(200, "OK", "Tag list fetched successfully", tags);
    }

    @PostMapping
    public ApiResponse createTag(@Valid @RequestBody CreateTagRequest request,
                                 @AuthenticationPrincipal UserDetails admin) {
        TagWithCountResponse tag = adminTagService.createTag(request, admin.getUsername());
        return new ApiResponse(201, "CREATED", "Tag created successfully", tag);
    }

    @PutMapping("/{tagId}")
    public ApiResponse updateTag(@PathVariable String tagId,
                                 @Valid @RequestBody UpdateTagRequest request,
                                 @AuthenticationPrincipal UserDetails admin) {
        TagWithCountResponse tag = adminTagService.updateTag(tagId, request, admin.getUsername());
        return new ApiResponse(200, "OK", "Tag updated successfully", tag);
    }

    @DeleteMapping("/{tagId}")
    public ApiResponse deleteTag(@PathVariable String tagId,
                                 @AuthenticationPrincipal UserDetails admin) {
        adminTagService.deleteTag(tagId, admin.getUsername());
        return new ApiResponse(204, "NO_CONTENT", "Tag deleted successfully", null);
    }
}