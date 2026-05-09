package com.gialai.tourism.services;

import org.springframework.web.multipart.MultipartFile;

public interface ImageService {
    String imagePath(MultipartFile multipartFile);
    boolean isValidSuffixImage(MultipartFile file);
    boolean deleteImage(String image);
    String replaceImage(MultipartFile multipartFile, String oldImageId);
}
