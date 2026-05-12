package com.gialai.tourism.specifications;

import com.gialai.tourism.models.entities.AdminLog;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Predicate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class AdminLogSpecification {

    public static Specification<AdminLog> hasAdminId(String adminId) {
        return (root, query, cb) -> {
            if (adminId == null) return cb.conjunction();
            return cb.equal(root.get("admin").get("id"), adminId);
        };
    }

    public static Specification<AdminLog> hasAction(String action) {
        return (root, query, cb) -> {
            if (action == null) return cb.conjunction();
            return cb.equal(root.get("action"), action);
        };
    }

    public static Specification<AdminLog> createdBetween(LocalDateTime from, LocalDateTime to) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (from != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("createdAt"), from));
            }
            if (to != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("createdAt"), to));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}