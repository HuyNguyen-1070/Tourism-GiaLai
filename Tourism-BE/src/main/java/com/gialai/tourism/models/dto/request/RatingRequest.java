package com.gialai.tourism.models.dto.request;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RatingRequest {
    @NotNull(message = "Score is required")
    @DecimalMin(value = "0.0", message = "Score must be at least 0.0")
    @DecimalMax(value = "5.0", message = "Score must be at most 5.0")
    private Double score;
}