package com.gialai.tourism.models.dto.request;

import com.gialai.tourism.enums.PostTag;
import com.gialai.tourism.enums.SourceType;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.List;

@Data
public class UpdatePostRequest {
    @NotBlank(message = "Title is required")
    @Size(min = 10, max = 255)
    private String title;

    @NotBlank(message = "Content is required")
    private String content;

    @Size(max = 500)
    private String summary;

    @NotEmpty(message = "At least one tag is required")
    @Size(max = 5)
    private List<PostTag> tags;

    private List<String> images;

    @NotNull(message = "Source type is required")
    private SourceType sourceType;

    private String sourceName;

    @AssertTrue(message = "sourceName is required when sourceType is EXTERNAL")
    private boolean isSourceNameValid() {
        return !(sourceType == SourceType.EXTERNAL && (sourceName == null || sourceName.isBlank()));
    }
}