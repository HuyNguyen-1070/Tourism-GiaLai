package com.gialai.tourism.models.entities;

import com.gialai.tourism.common.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "history_timelines")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class HistoryTimeline extends BaseEntity {

    @Column(nullable = false)
    private Integer year;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "location_name", length = 255)
    private String locationName;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "related_post_id")
    private Post relatedPost;

    @Column(name = "display_order")
    private Integer displayOrder;
}