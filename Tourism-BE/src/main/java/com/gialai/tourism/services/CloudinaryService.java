package com.gialai.tourism.services;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface CloudinaryService {
    void deleteFile(String fileId) throws IOException;
    String uploadFile(MultipartFile file) throws IOException;
    String replaceFile(MultipartFile file, String publicId) throws IOException;
}
