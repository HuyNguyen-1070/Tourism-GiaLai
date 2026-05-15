package com.gialai.tourism.services.implement;

import com.gialai.tourism.enums.ErrorCode;
import com.gialai.tourism.enums.PostStatus;
import com.gialai.tourism.exceptions.AppException;
import com.gialai.tourism.models.dto.response.AttractionResponse;
import com.gialai.tourism.models.dto.response.PageResponse;
import com.gialai.tourism.models.dto.response.PostResponse;
import com.gialai.tourism.models.entities.Post;
import com.gialai.tourism.models.entities.Tag;
import com.gialai.tourism.models.mappers.PostMapper;
import com.gialai.tourism.repositories.PostRepository;
import com.gialai.tourism.services.AttractionService;
import com.gialai.tourism.services.PostService;
import com.gialai.tourism.specifications.PostSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.JpaSort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttractionServiceImpl implements AttractionService {

    private final PostRepository postRepository;
    private final PostMapper postMapper;
    private final PostService postService;

    private static final String LOCATION_TAG = "LOCATION";

    @Override
    @Transactional(readOnly = true)
    public PageResponse<AttractionResponse> getAttractions(int page, int size,
                                                           List<String> tags,
                                                           String keyword,
                                                           String sort) {
        List<String> allTags = new ArrayList<>();
        allTags.add(LOCATION_TAG);
        if (tags != null && !tags.isEmpty()) {
            allTags.addAll(tags.stream().map(String::toUpperCase).toList());
        }

        Specification<Post> spec = Specification.allOf(
                PostSpecification.hasStatus(PostStatus.APPROVED),
                PostSpecification.hasTags(allTags)
        );

        if (keyword != null && !keyword.isBlank()) {
            spec = spec.and(PostSpecification.containsKeyword(keyword));
        }

        Sort sortObj = parseSort(sort, "engagementScore");
        Pageable pageable = PageRequest.of(page, size, sortObj);

        Page<Post> postPage = postRepository.findAll(spec, pageable);
        List<AttractionResponse> content = postPage.getContent().stream()
                .map(this::toAttractionResponse)
                .collect(Collectors.toList());

        return PageResponse.<AttractionResponse>builder()
                .content(content)
                .page(postPage.getNumber())
                .size(postPage.getSize())
                .totalElements(postPage.getTotalElements())
                .totalPages(postPage.getTotalPages())
                .build();
    }

    @Override
    public PostResponse getAttractionDetail(String postId) {
        PostResponse postResponse = postService.getPostDetail(postId, null);
        Post post = postService.findPostById(postId);
        boolean hasLocationTag = post.getTags().stream()
                .anyMatch(t -> t.getName().equalsIgnoreCase(LOCATION_TAG));
        if (!hasLocationTag) {
            throw new AppException(ErrorCode.POST_NOT_FOUND, postId);
        }
        return postResponse;
    }

    private AttractionResponse toAttractionResponse(Post post) {
        List<String> images = post.getImages() != null
                ? post.getImages().stream().limit(3).collect(Collectors.toList())
                : Collections.emptyList();

        Double lat = null;
        Double lng = null;
        if (post.getLocation() != null) {
            lat = post.getLocation().getLatitude();
            lng = post.getLocation().getLongitude();
        }

        long engagementScore = post.getViewCount() + post.getLikeCount() + post.getFavoriteCount();

        return AttractionResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .summary(post.getSummary())
                .tags(post.getTags().stream().map(Tag::getName).collect(Collectors.toList()))
                .images(images)
                .sourceType(post.getSourceType().name())
                .authorUsername(post.getAuthor() != null ? post.getAuthor().getUsername() : null)
                .sourceName(post.getSourceName())
                .status(post.getStatus().name())
                .latitude(lat)
                .longitude(lng)
                .viewCount(post.getViewCount())
                .likeCount(post.getLikeCount())
                .favoriteCount(post.getFavoriteCount())
                .averageRating(post.getAverageRating())
                .engagementScore(engagementScore)
                .createdAt(post.getCreatedAt())
                .build();
    }

    private Sort parseSort(String sortStr, String defaultField) {
        if (sortStr == null || sortStr.isBlank()) {
            sortStr = defaultField + ",desc";
        }
        String[] parts = sortStr.split(",");
        String field = parts[0].trim();
        Sort.Direction direction = parts.length > 1 && parts[1].trim().equalsIgnoreCase("asc")
                ? Sort.Direction.ASC : Sort.Direction.DESC;

        if ("engagementScore".equalsIgnoreCase(field)) {
            return JpaSort.unsafe(direction, "(p.viewCount + p.likeCount + p.favoriteCount)");
        }
        return Sort.by(direction, field);
    }
}