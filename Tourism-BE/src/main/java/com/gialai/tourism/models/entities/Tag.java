package com.gialai.tourism.models.entities;

import com.gialai.tourism.common.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tags")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class Tag extends BaseEntity {
    @Column(unique = true, nullable = false, length = 50)
    private String name;
}