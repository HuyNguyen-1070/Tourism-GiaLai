package com.gialai.tourism.services.implement;

import com.gialai.tourism.enums.*;
import com.gialai.tourism.exceptions.AppException;
import com.gialai.tourism.models.dto.response.PageResponse;
import com.gialai.tourism.models.dto.response.PostResponse;
import com.gialai.tourism.models.dto.response.PostSummaryResponse;
import com.gialai.tourism.models.entities.Account;
import com.gialai.tourism.models.entities.Post;
import com.gialai.tourism.models.mappers.PostMapper;
import com.gialai.tourism.repositories.PostRepository;
import com.gialai.tourism.services.AccountService;
import com.gialai.tourism.services.AdminPostService;
import com.gialai.tourism.services.NotificationService;
import com.gialai.tourism.specifications.PostSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminPostServiceImpl implements AdminPostService {

    private final PostRepository postRepository;
    private final PostMapper postMapper;
    private final AccountService accountService;
    private final NotificationService notificationService;

    @Override
    public PageResponse<PostSummaryResponse> getPosts(String status, List<String> tags, String keyword,
                                                      String authorId, LocalDateTime from, LocalDateTime to,
                                                      int page, int size, String sortDir) {
        PostStatus postStatus = status != null ? PostStatus.valueOf(status.toUpperCase()) : PostStatus.PENDING;

        // Base specification: not deleted + status
        Specification<Post> spec = Specification.allOf(
                PostSpecification.notDeleted(),
                PostSpecification.hasStatus(postStatus)
        );

        if (tags != null && !tags.isEmpty()) {
            spec = spec.and(PostSpecification.hasTags(tags));   // hasTags now accepts List<String>
        }
        if (keyword != null && !keyword.isBlank()) {
            spec = spec.and(PostSpecification.containsKeyword(keyword));
        }
        if (authorId != null && !authorId.isBlank()) {
            spec = spec.and(PostSpecification.hasAuthorId(authorId));
        }
        if (from != null || to != null) {
            spec = spec.and(PostSpecification.createdBetween(from, to));
        }

        Sort sort = Sort.by(sortDir != null && sortDir.equalsIgnoreCase("desc") ?
                Sort.Direction.DESC : Sort.Direction.ASC, "createdAt");
        PageRequest pageRequest = PageRequest.of(page, size, sort);
        Page<Post> postPage = postRepository.findAll(spec, pageRequest);
        return buildPageResponse(postPage.map(postMapper::toSummary), postPage);
    }

    @Override
    @Transactional
    @CacheEvict(value = {"featuredPosts", "attractiveLocations", "culturalEvents"}, allEntries = true)
    public PostResponse approvePost(String postId, String adminUsername) {
        Post post = getPendingPost(postId);
        Account admin = accountService.findByUsername(adminUsername);
        post.setStatus(PostStatus.APPROVED);
        post.setApprovedAt(LocalDateTime.now());
        post.setApprovedBy(admin);
        postRepository.save(post);
        notificationService.notifyUser(post.getAuthor().getEmail(),
                "Bài viết '" + post.getTitle() + "' đã được duyệt.",
                post.getId(), NotificationType.POST_APPROVED);
        return postMapper.toResponse(post);
    }

    @Override
    @Transactional
    public PostResponse rejectPost(String postId, String reason, String adminUsername) {
        Post post = getPendingPost(postId);
        Account admin = accountService.findByUsername(adminUsername);
        post.setStatus(PostStatus.REJECTED);
        post.setRejectedAt(LocalDateTime.now());
        post.setRejectedBy(admin);
        post.setRejectionReason(reason);
        postRepository.save(post);
        notificationService.notifyUser(post.getAuthor().getEmail(),
                "Bài viết '" + post.getTitle() + "' đã bị từ chối. Lý do: " + reason,
                post.getId(), NotificationType.POST_REJECTED);
        return postMapper.toResponse(post);
    }

    @Override
    @Transactional
    public void deletePost(String postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_FOUND, postId));
        if (post.getStatus() == PostStatus.DELETED) {
            throw new AppException(ErrorCode.POST_NOT_FOUND, postId);
        }
        post.setStatus(PostStatus.DELETED);
        postRepository.save(post);
    }

    private Post getPendingPost(String postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_FOUND, postId));
        if (post.getStatus() != PostStatus.PENDING) {
            throw new AppException(ErrorCode.POST_ALREADY_PROCESSED, postId);
        }
        return post;
    }

    private <T> PageResponse<T> buildPageResponse(Page<T> page, Page<?> original) {
        return PageResponse.<T>builder()
                .content(page.getContent())
                .page(original.getNumber())
                .size(original.getSize())
                .totalElements(original.getTotalElements())
                .totalPages(original.getTotalPages())
                .build();
    }
}