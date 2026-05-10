package com.gialai.tourism.models.Mappers;

import com.gialai.tourism.models.dto.request.CreatePostRequest;
import com.gialai.tourism.models.dto.request.UpdatePostRequest;
import com.gialai.tourism.models.dto.response.PostResponse;
import com.gialai.tourism.models.dto.response.PostSummaryResponse;
import com.gialai.tourism.models.entities.Post;
import org.springframework.stereotype.Component;

@Component
public class PostMapper {

    public Post toEntity(CreatePostRequest request) {
        return Post.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .summary(request.getSummary())
                .sourceType(request.getSourceType())
                .sourceName(request.getSourceName())
                .images(request.getImages())
                .tags(request.getTags())
                .build();
    }

    public void updateEntity(Post post, UpdatePostRequest request) {
        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setSummary(request.getSummary());
        post.setSourceType(request.getSourceType());
        post.setSourceName(request.getSourceName());
        post.setImages(request.getImages());
        post.setTags(request.getTags());
    }

    public PostResponse toResponse(Post post) {
        return PostResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
                .summary(post.getSummary())
                .tags(post.getTags())
                .images(post.getImages())
                .sourceType(post.getSourceType())
                .sourceName(post.getSourceName())
                .authorUsername(post.getAuthor().getUsername())
                .status(post.getStatus())
                .viewCount(post.getViewCount())
                .likeCount(post.getLikeCount())
                .favoriteCount(post.getFavoriteCount())
                .averageRating(post.getAverageRating())
                .ratingCount(post.getRatingCount())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .approvedAt(post.getApprovedAt())
                .rejectedAt(post.getRejectedAt())
                .approvedByUsername(post.getApprovedBy() != null ? post.getApprovedBy().getUsername() : null)
                .rejectedByUsername(post.getRejectedBy() != null ? post.getRejectedBy().getUsername() : null)
                .rejectionReason(post.getRejectionReason())
                .build();
    }

    public PostSummaryResponse toSummary(Post post) {
        return PostSummaryResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .summary(post.getSummary())
                .tags(post.getTags())
                .authorUsername(post.getAuthor().getUsername())
                .status(post.getStatus())
                .viewCount(post.getViewCount())
                .likeCount(post.getLikeCount())
                .favoriteCount(post.getFavoriteCount())
                .averageRating(post.getAverageRating())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }
}