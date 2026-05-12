package com.gialai.tourism.models.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateTagRequest {
    @NotBlank(message = "Tag name is required")
    @Size(min = 2, max = 50)
    @Pattern(regexp = "^[A-Z_]+$")
    private String name;
}
