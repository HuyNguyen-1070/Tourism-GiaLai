package com.gialai.tourism.models.dto.request;

import com.gialai.tourism.enums.PostTag;
import com.gialai.tourism.enums.SourceType;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.List;

@Data
public class CreatePostRequest {
    @NotBlank(message = "Title is required")
    @Size(min = 10, max = 255, message = "Title must be between 10 and 255 characters")
    private String title;

    @NotBlank(message = "Content is required")
    private String content;

    @Size(max = 500, message = "Summary must be at most 500 characters")
    private String summary;

    @NotEmpty(message = "At least one tag is required")
    @Size(max = 5, message = "Maximum 5 tags allowed")
    private List<String> tags;

    private List<String> images;

    @NotNull(message = "Source type is required")
    private SourceType sourceType;

    private String sourceName;

    @AssertTrue(message = "sourceName is required when sourceType is EXTERNAL")
    private boolean isSourceNameValid() {
        if (sourceType == SourceType.EXTERNAL) {
            return sourceName != null && !sourceName.isBlank();
        }
        return true;
    }
}