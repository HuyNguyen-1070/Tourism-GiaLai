package com.gialai.tourism.models.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class HistoryTimelineRequest {

    @Min(value = 1, message = "Year must be a positive integer")
    private Integer year;

    @NotBlank(message = "Title is required")
    @Size(max = 255)
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @Size(max = 255)
    private String locationName;

    private String imageUrl;

    private String relatedPostId;

    private Integer displayOrder;
}