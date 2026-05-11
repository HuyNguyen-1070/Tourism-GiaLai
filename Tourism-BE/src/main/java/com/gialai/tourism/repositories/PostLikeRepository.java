package com.gialai.tourism.repositories;

import com.gialai.tourism.models.entities.PostLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PostLikeRepository extends JpaRepository<PostLike, String> {
    Optional<PostLike> findByPostIdAndAccountId(String postId, String accountId);
    boolean existsByPostIdAndAccountId(String postId, String accountId);
    long countByPostId(String postId);
}