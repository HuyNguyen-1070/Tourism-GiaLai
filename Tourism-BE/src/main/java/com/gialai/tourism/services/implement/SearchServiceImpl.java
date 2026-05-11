package com.gialai.tourism.services.implement;

import com.gialai.tourism.enums.ErrorCode;
import com.gialai.tourism.enums.PostStatus;
import com.gialai.tourism.exceptions.AppException;
import com.gialai.tourism.models.dto.response.PageResponse;
import com.gialai.tourism.models.dto.response.SearchPostResponse;
import com.gialai.tourism.models.entities.Post;
import com.gialai.tourism.models.mappers.SearchPostMapper;
import com.gialai.tourism.repositories.PostRepository;
import com.gialai.tourism.services.SearchService;
import com.gialai.tourism.specifications.PostSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SearchServiceImpl implements SearchService {

    private final PostRepository postRepository;
    private final SearchPostMapper searchPostMapper;

    @Override
    public PageResponse<SearchPostResponse> search(String keyword, List<String> tags,
                                                   LocalDateTime fromDate, LocalDateTime toDate,
                                                   String sortField, String direction,
                                                   int page, int size) {
        // Base specification: not deleted + approved
        Specification<Post> spec = Specification.allOf(
                PostSpecification.notDeleted(),
                PostSpecification.hasStatus(PostStatus.APPROVED)
        );

        if (keyword != null && !keyword.isBlank()) {
            spec = spec.and(PostSpecification.containsKeyword(keyword.trim()));
        }
        if (tags != null && !tags.isEmpty()) {
            spec = spec.and(PostSpecification.hasTags(tags));
        }
        if (fromDate != null || toDate != null) {
            spec = spec.and(PostSpecification.createdBetween(fromDate, toDate));
        }

        Sort sort = buildSort(sortField, direction);
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Post> postPage = postRepository.findAll(spec, pageable);
        List<SearchPostResponse> content = postPage.getContent()
                .stream()
                .map(searchPostMapper::toResponse)
                .collect(Collectors.toList());

        return PageResponse.<SearchPostResponse>builder()
                .content(content)
                .page(postPage.getNumber())
                .size(postPage.getSize())
                .totalElements(postPage.getTotalElements())
                .totalPages(postPage.getTotalPages())
                .build();
    }

    private Sort buildSort(String sortField, String direction) {
        if (sortField == null || sortField.isBlank()) {
            sortField = "createdAt";
        }
        Set<String> validSortFields = Set.of("createdAt", "viewCount", "likeCount", "averageRating");
        if (!validSortFields.contains(sortField)) {
            throw new AppException(ErrorCode.VALIDATION_ERROR, "Invalid sort field: " + sortField);
        }
        Sort.Direction dir = "asc".equalsIgnoreCase(direction) ? Sort.Direction.ASC : Sort.Direction.DESC;
        return Sort.by(dir, sortField);
    }
}