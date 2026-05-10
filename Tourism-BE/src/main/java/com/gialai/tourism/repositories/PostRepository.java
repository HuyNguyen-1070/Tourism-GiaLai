package com.gialai.tourism.repositories;

import com.gialai.tourism.enums.PostStatus;
import com.gialai.tourism.models.entities.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PostRepository extends JpaRepository<Post, String>, JpaSpecificationExecutor<Post> {
    Page<Post> findByAuthorIdAndStatusNot(String authorId, PostStatus status, Pageable pageable);
    Optional<Post> findByIdAndStatusNot(String id, PostStatus status);
}