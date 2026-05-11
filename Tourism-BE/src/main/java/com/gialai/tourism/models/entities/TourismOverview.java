package com.gialai.tourism.models.entities;

import com.gialai.tourism.common.base.BaseEntity;
import com.gialai.tourism.common.utils.JsonListConverter;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "tourism_overview")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class TourismOverview extends BaseEntity {

    @Column(columnDefinition = "TEXT")
    @Convert(converter = JsonListConverter.class)
    private List<String> highlights;

    @Column(name = "revenue_last_year")
    private Long revenueLastYear;

    @Column(name = "revenue_note", length = 500)
    private String revenueNote;

    @Column(name = "infrastructure_info", columnDefinition = "TEXT")
    @Convert(converter = JsonListConverter.class)
    private List<String> infrastructureInfo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "updated_by")
    private Account updatedBy;
}