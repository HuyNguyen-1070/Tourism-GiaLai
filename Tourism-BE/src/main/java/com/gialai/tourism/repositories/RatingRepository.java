package com.gialai.tourism.repositories;

import com.gialai.tourism.models.entities.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RatingRepository extends JpaRepository<Rating, String> {
    Optional<Rating> findByPostIdAndAccountId(String postId, String accountId);

    @Query("SELECT COALESCE(AVG(r.score), 0.0) FROM Rating r WHERE r.post.id = :postId")
    double calculateAverageByPostId(@Param("postId") String postId);
}