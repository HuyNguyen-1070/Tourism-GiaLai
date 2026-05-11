package com.gialai.tourism.services.implement;

import com.gialai.tourism.enums.ErrorCode;
import com.gialai.tourism.enums.PostStatus;
import com.gialai.tourism.exceptions.AppException;
import com.gialai.tourism.models.dto.response.PageResponse;
import com.gialai.tourism.models.dto.response.PostSummaryResponse;
import com.gialai.tourism.models.entities.Post;
import com.gialai.tourism.models.mappers.PostMapper;
import com.gialai.tourism.repositories.PostRepository;
import com.gialai.tourism.services.EventFestivalService;
import com.gialai.tourism.specifications.PostSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.JpaSort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EventFestivalServiceImpl implements EventFestivalService {

    private final PostRepository postRepository;
    private final PostMapper postMapper;

    private static final List<String> VALID_EVENT_TAGS = Arrays.asList("FESTIVAL", "EVENT");

    @Override
    @Transactional(readOnly = true)
    public PageResponse<PostSummaryResponse> getEventsFestivals(int page, int size,
                                                                List<String> tags,
                                                                String keyword,
                                                                LocalDateTime fromDate,
                                                                LocalDateTime toDate,
                                                                String sort) {
        if (fromDate != null && toDate != null && fromDate.isAfter(toDate)) {
            throw new AppException(ErrorCode.VALIDATION_ERROR, "fromDate must be before or equal to toDate");
        }

        List<String> effectiveTags;
        if (tags == null || tags.isEmpty()) {
            effectiveTags = VALID_EVENT_TAGS;
        } else {
            for (String tag : tags) {
                if (!VALID_EVENT_TAGS.contains(tag.toUpperCase())) {
                    throw new AppException(ErrorCode.INVALID_TAG,
                            "Invalid tag: " + tag + ". Allowed: FESTIVAL, EVENT");
                }
            }
            effectiveTags = tags.stream().map(String::toUpperCase).toList();
        }

        Specification<Post> spec = Specification.allOf(
                PostSpecification.hasStatus(PostStatus.APPROVED),
                PostSpecification.hasTags(effectiveTags)
        );

        if (keyword != null && !keyword.isBlank()) {
            if (keyword.length() > 200) {
                throw new AppException(ErrorCode.VALIDATION_ERROR, "keyword must not exceed 200 characters");
            }
            spec = spec.and(PostSpecification.containsKeyword(keyword));
        }

        if (fromDate != null || toDate != null) {
            spec = spec.and(PostSpecification.createdBetween(fromDate, toDate));
        }

        Sort sortObj = parseSort(sort, "createdAt");
        Pageable pageable = PageRequest.of(page, size, sortObj);

        Page<Post> postPage = postRepository.findAll(spec, pageable);

        List<PostSummaryResponse> content = postPage.getContent().stream()
                .map(postMapper::toSummary)
                .toList();

        return PageResponse.<PostSummaryResponse>builder()
                .content(content)
                .page(postPage.getNumber())
                .size(postPage.getSize())
                .totalElements(postPage.getTotalElements())
                .totalPages(postPage.getTotalPages())
                .build();
    }


    private Sort parseSort(String sortStr, String defaultField) {
        if (sortStr == null || sortStr.isBlank()) {
            return Sort.by(Sort.Direction.DESC, defaultField);
        }

        String[] parts = sortStr.split(",");
        String field = parts[0].trim();
        Sort.Direction direction = parts.length > 1 && parts[1].trim().equalsIgnoreCase("asc")
                ? Sort.Direction.ASC
                : Sort.Direction.DESC;

        if ("engagementScore".equalsIgnoreCase(field)) {
            return JpaSort.unsafe(direction, "(p.viewCount + p.likeCount + p.favoriteCount)");
        }

        return Sort.by(direction, field);
    }
}