package com.gialai.tourism.services.implement;


import com.gialai.tourism.models.dto.response.HomepagePostResponse;
import com.gialai.tourism.models.entities.Post;
import com.gialai.tourism.models.entities.Tag;
import com.gialai.tourism.repositories.PostRepository;
import com.gialai.tourism.services.HomepageService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HomepageServiceImpl implements HomepageService {

    private final PostRepository postRepository;

    @Override
    @Cacheable(value = "featuredPosts", unless = "#result.isEmpty()")
    public List<HomepagePostResponse> getFeaturedPosts() {
        LocalDateTime weekAgo = LocalDateTime.now().minusDays(7);
        List<Post> posts = postRepository.findFeaturedPosts(weekAgo, PageRequest.of(0, 4));
        if (posts.size() < 4) {
            LocalDateTime monthAgo = LocalDateTime.now().minusDays(30);
            posts = postRepository.findFeaturedPosts(monthAgo, PageRequest.of(0, 4));
        }
        return posts.stream().map(this::toHomepageResponse).collect(Collectors.toList());
    }

    @Override
    @Cacheable(value = "attractiveLocations", unless = "#result.isEmpty()")
    public List<HomepagePostResponse> getAttractiveLocations() {
        LocalDateTime monthAgo = LocalDateTime.now().minusDays(30);
        List<Post> posts = postRepository.findTopPostsByTags(
                List.of("LOCATION"), monthAgo, PageRequest.of(0, 10));
        return posts.stream().map(this::toHomepageResponse).collect(Collectors.toList());
    }

    @Override
    @Cacheable(value = "culturalEvents", unless = "#result.isEmpty()")
    public List<HomepagePostResponse> getCulturalEvents() {
        LocalDateTime monthAgo = LocalDateTime.now().minusDays(30);
        List<Post> posts = postRepository.findTopPostsByTags(
                List.of("CULTURE", "HISTORY", "FESTIVAL", "EVENT"),
                monthAgo,
                PageRequest.of(0, 6));
        return posts.stream().map(this::toHomepageResponse).collect(Collectors.toList());
    }

    private HomepagePostResponse toHomepageResponse(Post post) {
        return HomepagePostResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .summary(post.getSummary())
                .tags(post.getTags().stream().map(Tag::getName).collect(Collectors.toList()))
                .thumbnail(post.getImages() != null && !post.getImages().isEmpty()
                        ? post.getImages().getFirst() : null)
                .sourceType(post.getSourceType().name())
                .authorUsername(post.getAuthor() != null ? post.getAuthor().getUsername() : null)
                .sourceName(post.getSourceName())
                .viewCount(post.getViewCount())
                .likeCount(post.getLikeCount())
                .favoriteCount(post.getFavoriteCount())
                .averageRating(post.getAverageRating())
                .status(post.getStatus().name())
                .engagementScore(post.getViewCount() + post.getLikeCount() + post.getFavoriteCount())
                .createdAt(post.getCreatedAt())
                .build();
    }
}