package com.gialai.tourism.models.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor @AllArgsConstructor
public class TourismOverviewResponse {
    private List<String> highlights;
    private Long revenueLastYear;
    private String revenueNote;
    private List<String> infrastructureInfo;
    private LocalDateTime updatedAt;
    private String updatedByUsername;
}