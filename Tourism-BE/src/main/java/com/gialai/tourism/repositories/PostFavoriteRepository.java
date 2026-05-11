package com.gialai.tourism.repositories;

import com.gialai.tourism.models.entities.PostFavorite;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PostFavoriteRepository extends JpaRepository<PostFavorite, String> {
    Optional<PostFavorite> findByPostIdAndAccountId(String postId, String accountId);
    boolean existsByPostIdAndAccountId(String postId, String accountId);
    long countByPostId(String postId);

    @Query("SELECT pf FROM PostFavorite pf JOIN FETCH pf.post p JOIN FETCH p.author WHERE pf.account.id = :accountId AND p.status = 'APPROVED' ORDER BY pf.createdAt DESC")
    Page<PostFavorite> findUserFavoritesWithPost(String accountId, Pageable pageable);

    @Query("SELECT pf FROM PostFavorite pf JOIN FETCH pf.post p JOIN FETCH p.author WHERE pf.account.id = :accountId AND p.status = 'APPROVED' AND LOWER(p.title) LIKE LOWER(CONCAT('%',:keyword,'%')) ORDER BY pf.createdAt DESC")
    Page<PostFavorite> findUserFavoritesWithPostByKeyword(String accountId, String keyword, Pageable pageable);
}