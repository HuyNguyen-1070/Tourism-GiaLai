package com.gialai.tourism.services.implement;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.gialai.tourism.enums.ErrorCode;
import com.gialai.tourism.exceptions.AppException;
import com.gialai.tourism.services.CloudinaryService;
import com.gialai.tourism.services.ImageService;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class ImageServiceImpl implements ImageService {
    private final CloudinaryService cloudinaryService;

    @Override
    public String imagePath(MultipartFile multipartFile){
        if (multipartFile != null){
            if (isValidSuffixImage(multipartFile)){
                try {
                    return cloudinaryService.uploadFile(multipartFile);
                } catch (IOException e) {
                    throw new AppException(ErrorCode.UPLOAD_FAILED);
                }
            }
            throw new AppException(ErrorCode.INVALID_IMAGE_FORMAT);
        }
        return "";
    }

    @Override
    public boolean isValidSuffixImage(MultipartFile file) {
        String imagePath = file.getOriginalFilename();
        if (imagePath == null)
            return false;

        String lowerPath = imagePath.toLowerCase();
        return lowerPath.endsWith(".png") ||
                lowerPath.endsWith(".jpeg") ||
                lowerPath.endsWith(".jpg") ||
                lowerPath.endsWith(".webp");
    }

    @Override
    public boolean deleteImage(String imageId) {
        if (imageId == null || imageId.trim().isEmpty()) {
            return true;
        }
        try {
            cloudinaryService.deleteFile(imageId);
            return true;
        } catch (IOException e) {
            throw new AppException(ErrorCode.IMAGE_DELETE_FAILED);
        }
    }

    @Override
    public String replaceImage(MultipartFile multipartFile, String oldImageId) {
        if (multipartFile != null) {
            if (isValidSuffixImage(multipartFile)) {
                try {
                    return cloudinaryService.replaceFile(multipartFile, oldImageId);
                } catch (IOException e) {
                    throw new AppException(ErrorCode.UPLOAD_FAILED);
                }
            }
            throw new AppException(ErrorCode.INVALID_IMAGE_FORMAT);
        }
        return "";
    }
}