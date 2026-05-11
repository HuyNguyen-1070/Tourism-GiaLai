package com.gialai.tourism.models.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class UpdateLocationRequest {
    @NotBlank
    private String postId;
    @NotBlank @Size(max = 255)
    private String name;
    @Size(max = 500)
    private String address;
    @NotNull
    private Double latitude;
    @NotNull
    private Double longitude;
    private String placeId;
}