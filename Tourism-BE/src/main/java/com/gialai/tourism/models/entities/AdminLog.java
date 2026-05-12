package com.gialai.tourism.models.entities;

import com.gialai.tourism.common.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "admin_logs")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class AdminLog extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_id", nullable = false)
    private Account admin;

    @Column(nullable = false, length = 50)
    private String action;

    @Column(name = "target_id", length = 20)
    private String targetId;

    @Column(name = "target_type", length = 50)
    private String targetType;

    @Column(columnDefinition = "TEXT")
    private String detail;
}