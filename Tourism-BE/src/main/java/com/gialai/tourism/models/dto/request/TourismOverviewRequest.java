package com.gialai.tourism.models.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class TourismOverviewRequest {

    @NotEmpty(message = "Highlights must contain at least one item")
    private List<String> highlights;

    @Min(value = 0, message = "Revenue must be >= 0")
    private Long revenueLastYear;

    @Size(max = 500)
    private String revenueNote;

    private List<String> infrastructureInfo;
}