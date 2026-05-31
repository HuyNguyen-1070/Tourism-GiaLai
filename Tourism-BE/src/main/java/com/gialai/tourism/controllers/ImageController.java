package com.gialai.tourism.controllers;

import com.gialai.tourism.common.base.ApiResponse;
import com.gialai.tourism.services.ImageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/images")
@RequiredArgsConstructor
@Tag(name = "Image Upload", description = "APIs for uploading images to Cloudinary")
public class ImageController {

    private final ImageService imageService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload image", description = "Upload a single image file and get back its permanent Cloudinary URL")
    public ApiResponse uploadImage(@RequestPart("file") MultipartFile file) {
        String url = imageService.imagePath(file);
        ApiResponse response = new ApiResponse();
        response.setCode(HttpStatus.OK.value());
        response.setStatus(HttpStatus.OK.getReasonPhrase());
        response.setMessage("Upload thành công");
        response.setData(Map.of("url", url));
        return response;
    }
}
