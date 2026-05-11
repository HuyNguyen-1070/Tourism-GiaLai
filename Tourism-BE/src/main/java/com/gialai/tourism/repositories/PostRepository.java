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
}