package com.gialai.tourism.services.implement;

import com.gialai.tourism.enums.ErrorCode;
import com.gialai.tourism.enums.PostStatus;
import com.gialai.tourism.enums.RoleType;
import com.gialai.tourism.exceptions.AppException;
import com.gialai.tourism.models.dto.request.CreatePostRequest;
import com.gialai.tourism.models.dto.request.UpdatePostRequest;
import com.gialai.tourism.models.dto.response.PageResponse;
import com.gialai.tourism.models.dto.response.PostResponse;
import com.gialai.tourism.models.dto.response.PostSummaryResponse;
import com.gialai.tourism.models.entities.Account;
import com.gialai.tourism.models.entities.Post;
import com.gialai.tourism.models.mappers.PostMapper;
import com.gialai.tourism.repositories.PostRepository;
import com.gialai.tourism.services.AccountService;
import com.gialai.tourism.services.NotificationService;
import com.gialai.tourism.services.PostService;
import com.gialai.tourism.specifications.PostSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;
    private final PostMapper postMapper;
    private final AccountService accountService;
    private final NotificationService notificationService;

    @Override
    @Transactional
    public PostResponse createPost(CreatePostRequest request, String username) {
        Account author = accountService.findByUsername(username);
        validatePlainTextLength(request.getContent(), 50);
        Post post = postMapper.toEntity(request);
        post.setAuthor(author);
        post.setStatus(PostStatus.PENDING);
        post.setViewCount(0);
        post.setLikeCount(0);
        post.setFavoriteCount(0);
        post.setAverageRating(0.0);
        post.setRatingCount(0);
        Post saved = postRepository.save(post);
        notificationService.notifyAdmins("Bài viết '" + saved.getTitle() + "' vừa được gửi chờ duyệt.", saved.getId(),
                com.gialai.tourism.enums.NotificationType.POST_SUBMITTED);
        return postMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public PostResponse updatePost(String postId, UpdatePostRequest request, String username) {
        Post post = findPostById(postId);
        Account currentUser = accountService.findByUsername(username);
        if (!post.getAuthor().getId().equals(currentUser.getId())) {
            throw new AppException(ErrorCode.NOT_POST_OWNER);
        }
        if (post.getStatus() == PostStatus.DELETED) {
            throw new AppException(ErrorCode.POST_DELETED);
        }
        validatePlainTextLength(request.getContent(), 50);
        postMapper.updateEntity(post, request);
        post.setStatus(PostStatus.PENDING);
        post = postRepository.save(post);
        notificationService.notifyAdmins("Bài viết '" + post.getTitle() + "' đã được chỉnh sửa và chờ duyệt lại.",
                post.getId(), com.gialai.tourism.enums.NotificationType.POST_UPDATED);
        return postMapper.toResponse(post);
    }

    @Override
    @Transactional
    public void deletePost(String postId, String username) {
        Post post = findPostById(postId);
        Account currentUser = accountService.findByUsername(username);
        if (!post.getAuthor().getId().equals(currentUser.getId())) {
            throw new AppException(ErrorCode.NOT_POST_OWNER);
        }
        if (post.getStatus() == PostStatus.DELETED) {
            throw new AppException(ErrorCode.POST_NOT_FOUND, postId);
        }
        post.setStatus(PostStatus.DELETED);
        postRepository.save(post);
    }

    @Override
    public PageResponse<PostSummaryResponse> getMyPosts(String username, int page, int size, String statusFilter) {
        Account author = accountService.findByUsername(username);
        PostStatus status = null;
        if (statusFilter != null && !statusFilter.isBlank()) {
            status = PostStatus.valueOf(statusFilter.toUpperCase());
        }
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Post> postPage;
        if (status != null) {
            postPage = postRepository.findAll(
                    Specification.where(PostSpecification.hasAuthorId(author.getId()))
                            .and(PostSpecification.hasStatus(status)),
                    pageRequest);
        } else {
            postPage = postRepository.findByAuthorIdAndStatusNot(author.getId(), PostStatus.DELETED, pageRequest);
        }
        return buildPageResponse(postPage.map(postMapper::toSummary), postPage);
    }

    @Override
    public PostResponse getPostDetail(String postId, String username) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_FOUND, postId));

        boolean isOwner = false;
        boolean isAdmin = false;
        if (username != null) {
            Account currentUser = accountService.findByUsername(username);
            isOwner = post.getAuthor().getId().equals(currentUser.getId());
            isAdmin = currentUser.getRoles().stream().anyMatch(r -> r.getName() == RoleType.ADMIN);
        }

        if (post.getStatus() == PostStatus.DELETED) {
            throw new AppException(ErrorCode.POST_NOT_FOUND, postId);
        }

        if (post.getStatus() != PostStatus.APPROVED && !isOwner && !isAdmin) {
            throw new AppException(ErrorCode.POST_NOT_FOUND, postId);
        }

        // Increase view count if viewer is not the author
        if (!isOwner) {
            post.setViewCount(post.getViewCount() + 1);
            postRepository.save(post);
        }

        return postMapper.toResponse(post);
    }

    @Override
    public Post findPostById(String postId) {
        return postRepository.findById(postId)
                .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_FOUND, postId));
    }

    private void validatePlainTextLength(String htmlContent, int minLength) {
        String plainText = htmlContent.replaceAll("<[^>]+>", "").trim();
        if (plainText.length() < minLength) {
            throw new AppException(ErrorCode.CONTENT_TOO_SHORT);
        }
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