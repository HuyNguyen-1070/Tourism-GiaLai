package com.gialai.tourism.specifications;

import com.gialai.tourism.enums.PostStatus;
import com.gialai.tourism.models.entities.Post;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class PostSpecification {
    public static Specification<Post> notDeleted() {
        return (root, query, cb) -> cb.notEqual(root.get("status"), PostStatus.DELETED);
    }

    public static Specification<Post> hasStatus(PostStatus status) {
        return (root, query, cb) -> cb.equal(root.get("status"), status);
    }

    public static Specification<Post> hasTags(List<String> tagNames) {
        return (root, query, cb) -> {
            if (tagNames == null || tagNames.isEmpty()) return cb.conjunction();
            Join<Object, Object> tags = root.join("tags");
            return tags.get("name").in(tagNames);
        };
    }

    public static Specification<Post> containsKeyword(String keyword) {
        return (root, query, cb) -> {
            if (keyword == null || keyword.isBlank()) return cb.conjunction();
            return cb.like(cb.lower(root.get("title")), "%" + keyword.toLowerCase() + "%");
        };
    }

    public static Specification<Post> hasAuthorId(String authorId) {
        return (root, query, cb) -> authorId == null ? cb.conjunction() : cb.equal(root.get("author").get("id"), authorId);
    }

    public static Specification<Post> createdBetween(LocalDateTime from, LocalDateTime to) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (from != null) predicates.add(cb.greaterThanOrEqualTo(root.get("createdAt"), from));
            if (to != null) predicates.add(cb.lessThanOrEqualTo(root.get("createdAt"), to));
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}