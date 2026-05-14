package com.gialai.tourism.repositories;

import com.gialai.tourism.enums.PostStatus;
import com.gialai.tourism.models.entities.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PostRepository extends JpaRepository<Post, String>, JpaSpecificationExecutor<Post> {
    Page<Post> findByAuthorIdAndStatusNot(String authorId, PostStatus status, Pageable pageable);
    Optional<Post> findByIdAndStatusNot(String id, PostStatus status);

    @Query("SELECT p FROM Post p WHERE p.status = 'APPROVED' " +
            "AND (p.createdAt >= :since OR p.updatedAt >= :since) " +
            "ORDER BY (p.viewCount + p.likeCount + p.favoriteCount) DESC")
    List<Post> findFeaturedPosts(@Param("since") LocalDateTime since, Pageable pageable);

    @Query("SELECT p FROM Post p JOIN p.tags t " +
            "WHERE p.status = 'APPROVED' AND t.name IN :tagNames " +
            "AND p.createdAt >= :since " +
            "GROUP BY p " +
            "ORDER BY (p.viewCount + p.likeCount + p.favoriteCount) DESC")
    List<Post> findTopPostsByTags(@Param("tagNames") List<String> tagNames,
                                  @Param("since") LocalDateTime since,
                                  Pageable pageable);

    long countByAuthorIdAndStatus(String authorId, PostStatus status);
    long countByAuthorIdAndStatusNot(String authorId, PostStatus status);

    long countByStatusNot(PostStatus status);
    long countByStatus(PostStatus status);

    long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
    long countByUpdatedAtBetweenAndCreatedAtBefore(LocalDateTime start, LocalDateTime end, LocalDateTime before);

    @Query("SELECT COUNT(p) FROM Post p JOIN p.tags t WHERE t.id = :tagId AND p.status = :status")
    long countByTagsContainingAndStatus(@Param("tagId") String tagId, @Param("status") PostStatus status);

    @Query("SELECT COUNT(p) FROM Post p JOIN p.tags t WHERE t.id = :tagId AND p.status <> :status")
    long countByTagsContainingAndStatusNot(@Param("tagId") String tagId, @Param("status") PostStatus status);

    long countByAuthorId(String authorId);

    @Query(value = "SELECT pt.tag_id, t.name, COUNT(DISTINCT p.id), SUM(p.like_count), SUM(p.favorite_count), AVG(p.average_rating), " +
            "SUM(p.like_count) + SUM(p.favorite_count) + AVG(p.average_rating) * 10 AS score " +
            "FROM post_tags pt JOIN posts p ON p.id = pt.post_id JOIN tags t ON t.id = pt.tag_id " +
            "WHERE p.status = :status AND (p.created_at >= :since OR p.updated_at >= :since) " +
            "GROUP BY pt.tag_id, t.name ORDER BY score DESC LIMIT :limit", nativeQuery = true)
    List<Object[]> trendingTags(@Param("since") LocalDateTime since, @Param("status") String status, @Param("limit") int limit);

    @Query(value = "SELECT p.id, p.title, a.username, p.view_count, p.like_count, p.favorite_count, p.average_rating, " +
            "(p.view_count + p.like_count + p.favorite_count) AS engagement " +
            "FROM posts p JOIN accounts a ON p.author_id = a.id " +
            "WHERE p.status = :status AND (p.created_at >= :since OR p.updated_at >= :since) " +
            "ORDER BY engagement DESC LIMIT :limit", nativeQuery = true)
    List<Object[]> topEngagedPostsWithoutTags(@Param("since") LocalDateTime since,
                                              @Param("status") String status,
                                              @Param("limit") int limit);

    @Query(value = "SELECT p.id, p.title, a.username, p.view_count, p.like_count, p.favorite_count, p.average_rating, " +
            "(p.view_count + p.like_count + p.favorite_count) AS engagement " +
            "FROM posts p JOIN accounts a ON p.author_id = a.id " +
            "WHERE p.status = :status AND (p.created_at >= :since OR p.updated_at >= :since) " +
            "AND EXISTS (SELECT 1 FROM post_tags pt JOIN tags t ON pt.tag_id = t.id WHERE pt.post_id = p.id AND t.name IN (:tagNames)) " +
            "ORDER BY engagement DESC LIMIT :limit", nativeQuery = true)
    List<Object[]> topEngagedPostsWithTags(@Param("since") LocalDateTime since,
                                           @Param("status") String status,
                                           @Param("tagNames") List<String> tagNames,
                                           @Param("limit") int limit);

    @Query("SELECT t.name FROM Post p JOIN p.tags t WHERE p.id = :postId")
    List<String> findTagNamesByPostId(@Param("postId") String postId);
}