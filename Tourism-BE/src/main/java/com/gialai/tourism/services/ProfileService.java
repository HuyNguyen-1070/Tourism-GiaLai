package com.gialai.tourism.services;

import com.gialai.tourism.models.dto.ProfileDTO;
import com.gialai.tourism.models.dto.ProfileUpdateDTO;
import org.springframework.web.multipart.MultipartFile;

public interface ProfileService {
    ProfileDTO getMyProfile(String email);
    ProfileDTO updateMyProfile(String email, ProfileUpdateDTO dto);
    String updateAvatar(String email, MultipartFile file);
}