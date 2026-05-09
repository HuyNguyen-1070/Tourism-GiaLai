package com.gialai.tourism.models.entities;

import com.gialai.tourism.common.base.BaseEntity;
import com.gialai.tourism.enums.RoleType;
import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity(name = "roles")
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Role extends BaseEntity {
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true, columnDefinition = "VARCHAR(255)")
    private RoleType name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToMany(mappedBy = "roles", fetch = FetchType.LAZY)
    private Set<Account> accounts;
}