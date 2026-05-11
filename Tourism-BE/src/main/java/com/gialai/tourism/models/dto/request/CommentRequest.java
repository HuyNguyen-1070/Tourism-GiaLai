package com.gialai.tourism.models.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CommentRequest {
    @NotBlank(message = "Comment content must not be blank")
    @Size(max = 2000, message = "Comment content cannot exceed 2000 characters")
    private String content;
}