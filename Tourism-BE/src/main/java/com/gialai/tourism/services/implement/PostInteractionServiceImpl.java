package com.gialai.tourism.services.implement;

import com.gialai.tourism.enums.*;
import com.gialai.tourism.exceptions.AppException;
import com.gialai.tourism.models.dto.request.CommentRequest;
import com.gialai.tourism.models.dto.request.RatingRequest;
import com.gialai.tourism.models.dto.response.*;
import com.gialai.tourism.models.entities.*;
import com.gialai.tourism.repositories.*;
import com.gialai.tourism.services.AccountService;
import com.gialai.tourism.services.NotificationService;
import com.gialai.tourism.services.PostInteractionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PostInteractionServiceImpl implements PostInteractionService {

    private final PostRepository postRepository;
    private final PostLikeRepository postLikeRepository;
    private final PostFavoriteRepository postFavoriteRepository;
    private final CommentRepository commentRepository;
    private final RatingRepository ratingRepository;
    private final AccountService accountService;
    private final NotificationService notificationService;

    @Override
    @Transactional
    public LikeResponse toggleLike(String postId, String username) {
        Post post = getApprovedPost(postId);
        Account account = accountService.findByUsername(username);

        Optional<PostLike> existing = postLikeRepository.findByPostIdAndAccountId(postId, account.getId());
        boolean liked;
        if (existing.isPresent()) {
            postLikeRepository.delete(existing.get());
            post.setLikeCount(Math.max(0, post.getLikeCount() - 1));
            liked = false;
        } else {
            PostLike like = PostLike.builder()
                    .post(post)
                    .account(account)
                    .build();
            postLikeRepository.save(like);
            post.setLikeCount(post.getLikeCount() + 1);
            liked = true;
        }
        postRepository.save(post);
        return new LikeResponse(postId, liked, post.getLikeCount());
    }

    @Override
    @Transactional
    public FavoriteResponse toggleFavorite(String postId, String username) {
        Post post = getApprovedPost(postId);
        Account account = accountService.findByUsername(username);

        Optional<PostFavorite> existing = postFavoriteRepository.findByPostIdAndAccountId(postId, account.getId());
        boolean favorited;
        if (existing.isPresent()) {
            postFavoriteRepository.delete(existing.get());
            post.setFavoriteCount(Math.max(0, post.getFavoriteCount() - 1));
            favorited = false;
        } else {
            PostFavorite fav = PostFavorite.builder()
                    .post(post)
                    .account(account)
                    .build();
            postFavoriteRepository.save(fav);
            post.setFavoriteCount(post.getFavoriteCount() + 1);
            favorited = true;
        }
        postRepository.save(post);
        return new FavoriteResponse(postId, favorited, post.getFavoriteCount());
    }

    @Override
    public PageResponse<PostSummaryResponse> getUserFavorites(String username, int page, int size, String keyword) {
        Account account = accountService.findByUsername(username);
        PageRequest pageRequest = PageRequest.of(page, size);
        Page<PostFavorite> favPage;
        if (keyword != null && !keyword.isBlank()) {
            favPage = postFavoriteRepository.findUserFavoritesWithPostByKeyword(account.getId(), keyword, pageRequest);
        } else {
            favPage = postFavoriteRepository.findUserFavoritesWithPost(account.getId(), pageRequest);
        }
        Page<PostSummaryResponse> summaryPage = favPage.map(fav -> {
            Post post = fav.getPost();
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
        });
        return PageResponse.<PostSummaryResponse>builder()
                .content(summaryPage.getContent())
                .page(favPage.getNumber())
                .size(favPage.getSize())
                .totalElements(favPage.getTotalElements())
                .totalPages(favPage.getTotalPages())
                .build();
    }

    @Override
    public PageResponse<CommentResponse> getComments(String postId, int page, int size) {
        getApprovedPost(postId);
        PageRequest pageRequest = PageRequest.of(page, size);
        Page<Comment> commentPage = commentRepository.findActiveCommentsByPostId(postId, pageRequest);
        Page<CommentResponse> responsePage = commentPage.map(this::mapCommentToResponse);
        return PageResponse.<CommentResponse>builder()
                .content(responsePage.getContent())
                .page(commentPage.getNumber())
                .size(commentPage.getSize())
                .totalElements(commentPage.getTotalElements())
                .totalPages(commentPage.getTotalPages())
                .build();
    }

    @Override
    @Transactional
    public CommentResponse addComment(String postId, String username, CommentRequest request) {
        Post post = getApprovedPost(postId);
        Account author = accountService.findByUsername(username);

        Comment comment = Comment.builder()
                .post(post)
                .author(author)
                .content(request.getContent())
                .isDeleted(false)
                .build();
        comment = commentRepository.save(comment);

        if (!post.getAuthor().getId().equals(author.getId())) {
            notificationService.notifyUser(
                    post.getAuthor().getEmail(),
                    "Người dùng " + author.getUsername() + " đã bình luận bài viết của bạn.",
                    post.getId(),
                    NotificationType.POST_COMMENTED
            );
        }

        return mapCommentToResponse(comment);
    }

    @Override
    @Transactional
    public CommentResponse updateComment(String commentId, String username, CommentRequest request) {
        Comment comment = commentRepository.findByIdAndIsDeletedFalse(commentId)
                .orElseThrow(() -> new AppException(ErrorCode.COMMENT_NOT_FOUND, commentId));

        Account currentUser = accountService.findByUsername(username);
        if (!comment.getAuthor().getId().equals(currentUser.getId())) {
            throw new AppException(ErrorCode.NOT_COMMENT_OWNER);
        }

        comment.setContent(request.getContent());
        comment = commentRepository.save(comment);
        return mapCommentToResponse(comment);
    }

    @Override
    @Transactional
    public void deleteComment(String commentId, String username) {
        Comment comment = commentRepository.findByIdAndIsDeletedFalse(commentId)
                .orElseThrow(() -> new AppException(ErrorCode.COMMENT_NOT_FOUND, commentId));

        Account currentUser = accountService.findByUsername(username);
        boolean isAdmin = currentUser.getRoles().stream().anyMatch(r -> r.getName() == RoleType.ADMIN);
        if (!comment.getAuthor().getId().equals(currentUser.getId()) && !isAdmin) {
            throw new AppException(ErrorCode.NOT_COMMENT_OWNER);
        }

        comment.setDeleted(true);
        commentRepository.save(comment);
    }

    @Override
    @Transactional
    public RatingResponse upsertRating(String postId, String username, RatingRequest request) {
        double score = request.getScore();
        if (score < 0.0 || score > 5.0 || Math.round(score * 2) != score * 2) {
            throw new AppException(ErrorCode.INVALID_RATING_SCORE);
        }

        Post post = getApprovedPost(postId);
        Account account = accountService.findByUsername(username);

        Optional<Rating> existing = ratingRepository.findByPostIdAndAccountId(postId, account.getId());
        if (existing.isPresent()) {
            existing.get().setScore(score);
            ratingRepository.save(existing.get());
        } else {
            Rating rating = Rating.builder()
                    .post(post)
                    .account(account)
                    .score(score)
                    .build();
            ratingRepository.save(rating);
            post.setRatingCount(post.getRatingCount() + 1);
        }

        double avg = ratingRepository.calculateAverageByPostId(postId);
        post.setAverageRating(avg);
        postRepository.save(post);

        return RatingResponse.builder()
                .postId(postId)
                .myScore(score)
                .averageRating(avg)
                .ratingCount(post.getRatingCount())
                .build();
    }

    @Override
    public RatingResponse getMyRating(String postId, String username) {
        getApprovedPost(postId);
        Account account = accountService.findByUsername(username);

        double myScore = ratingRepository.findByPostIdAndAccountId(postId, account.getId())
                .map(Rating::getScore)
                .orElse(null);
        Post post = postRepository.findById(postId).orElseThrow();
        return RatingResponse.builder()
                .postId(postId)
                .myScore(myScore)
                .averageRating(post.getAverageRating())
                .ratingCount(post.getRatingCount())
                .build();
    }

    @Override
    public InteractionStatusResponse getInteractionStatus(String postId, String username) {
        Post post = getApprovedPost(postId);
        Account account = accountService.findByUsername(username);

        boolean liked = postLikeRepository.existsByPostIdAndAccountId(postId, account.getId());
        boolean favorited = postFavoriteRepository.existsByPostIdAndAccountId(postId, account.getId());
        Double myScore = ratingRepository.findByPostIdAndAccountId(postId, account.getId())
                .map(Rating::getScore)
                .orElse(null);

        return InteractionStatusResponse.builder()
                .postId(postId)
                .liked(liked)
                .favorited(favorited)
                .myScore(myScore)
                .likeCount(post.getLikeCount())
                .favoriteCount(post.getFavoriteCount())
                .averageRating(post.getAverageRating())
                .ratingCount(post.getRatingCount())
                .build();
    }

    private Post getApprovedPost(String postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_AVAILABLE, postId));
        if (post.getStatus() != PostStatus.APPROVED) {
            throw new AppException(ErrorCode.POST_NOT_AVAILABLE, postId);
        }
        return post;
    }

    private CommentResponse mapCommentToResponse(Comment comment) {
        Account author = comment.getAuthor();
        return CommentResponse.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .authorUsername(author.getUsername())
                .authorAvatar(author.getAvatar())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .isEdited(!comment.getCreatedAt().equals(comment.getUpdatedAt()))
                .build();
    }
}