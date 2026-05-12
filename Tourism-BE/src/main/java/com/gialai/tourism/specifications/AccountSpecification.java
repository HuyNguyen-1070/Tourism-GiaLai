package com.gialai.tourism.specifications;

import com.gialai.tourism.models.entities.Account;
import com.gialai.tourism.enums.RoleType;
import jakarta.persistence.criteria.Join;
import org.springframework.data.jpa.domain.Specification;

public class AccountSpecification {
    public static Specification<Account> hasKeyword(String keyword) {
        return (root, query, cb) -> {
            if (keyword == null || keyword.isBlank()) return cb.conjunction();
            String like = "%" + keyword.toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(root.get("username")), like),
                    cb.like(cb.lower(root.get("email")), like),
                    cb.like(cb.lower(root.get("fullName")), like)
            );
        };
    }

    public static Specification<Account> isActive(Boolean isActive) {
        return (root, query, cb) -> isActive == null ? cb.conjunction() : cb.equal(root.get("isActive"), isActive);
    }

    public static Specification<Account> hasRole(String role) {
        return (root, query, cb) -> {
            if (role == null) return cb.conjunction();
            Join<Object, Object> roles = root.join("roles");
            return cb.equal(roles.get("name"), RoleType.valueOf(role.toUpperCase()));
        };
    }
}