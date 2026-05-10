package com.gialai.tourism.specifications;

import com.gialai.tourism.enums.PostStatus;
import com.gialai.tourism.enums.PostTag;
import com.gialai.tourism.models.entities.Post;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;
import java.util.List;

public class PostSpecification {

    public static Specification<Post> hasStatus(PostStatus status) {
        return (root, query, cb) -> status == null ? null : cb.equal(root.get("status"), status);
    }

    public static Specification<Post> hasTags(List<PostTag> tags) {
        return (root, query, cb) -> {
            if (tags == null || tags.isEmpty()) return null;
            query.distinct(true);
            return root.join("tags").in(tags);
        };
    }

    public static Specification<Post> containsKeyword(String keyword) {
        return (root, query, cb) -> {
            if (keyword == null || keyword.isBlank()) return null;
            String pattern = "%" + keyword.toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(root.get("title")), pattern),
                    cb.like(cb.lower(root.get("summary")), pattern)
            );
        };
    }

    public static Specification<Post> hasAuthorId(String authorId) {
        return (root, query, cb) -> authorId == null ? null :
                cb.equal(root.get("author").get("id"), authorId);
    }

    public static Specification<Post> createdBetween(LocalDateTime from, LocalDateTime to) {
        return (root, query, cb) -> {
            if (from == null && to == null) return null;
            if (from != null && to != null) return cb.between(root.get("createdAt"), from, to);
            if (from != null) return cb.greaterThanOrEqualTo(root.get("createdAt"), from);
            return cb.lessThanOrEqualTo(root.get("createdAt"), to);
        };
    }

    public static Specification<Post> notDeleted() {
        return (root, query, cb) -> cb.notEqual(root.get("status"), PostStatus.DELETED);
    }
}