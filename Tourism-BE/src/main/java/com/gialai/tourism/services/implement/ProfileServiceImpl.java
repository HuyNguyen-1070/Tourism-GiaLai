package com.gialai.tourism.services.implement;

import com.gialai.tourism.common.constants.Constant;
import com.gialai.tourism.common.utils.Util;
import com.gialai.tourism.enums.ErrorCode;
import com.gialai.tourism.exceptions.AppException;
import com.gialai.tourism.models.dto.ProfileDTO;
import com.gialai.tourism.models.dto.ProfileUpdateDTO;
import com.gialai.tourism.models.entities.Account;
import com.gialai.tourism.models.mappers.ProfileMapper;
import com.gialai.tourism.repositories.AccountRepository;
import com.gialai.tourism.services.ImageService;
import com.gialai.tourism.services.ProfileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProfileServiceImpl implements ProfileService {

    private final AccountRepository accountRepository;
    private final ProfileMapper profileMapper;
    private final ImageService imageService;

    @Override
    public ProfileDTO getMyProfile(String email) {
        Account account = accountRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND, "Account"));
        return profileMapper.toProfileDTO(account);
    }

    @Override
    @Transactional
    public ProfileDTO updateMyProfile(String email, ProfileUpdateDTO dto) {
        Account account = accountRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND, "Account"));

        if (dto.getFullName() != null) {
            account.setFullName(dto.getFullName());
        }
        if (dto.getPhone() != null) {
            if (!dto.getPhone().equals(account.getPhone()) &&
                    accountRepository.existsByPhone(dto.getPhone())) {
                throw new AppException(ErrorCode.RESOURCE_ALREADY_EXISTS, "Phone number");
            }
            account.setPhone(dto.getPhone());
        }
        if (dto.getAddress() != null) {
            account.setAddress(dto.getAddress());
        }

        accountRepository.save(account);
        return profileMapper.toProfileDTO(account);
    }

    @Override
    @Transactional
    public String updateAvatar(String email, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new AppException(ErrorCode.VALIDATION_ERROR, "Avatar file is required.");
        }
        if (file.getSize() > Constant.MAX_FILE_SIZE_5MB) {
            throw new AppException(ErrorCode.IMAGE_SIZE_EXCEEDED);
        }
        if (!imageService.isValidSuffixImage(file)) {
            throw new AppException(ErrorCode.INVALID_IMAGE_FORMAT);
        }

        Account account = accountRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND, "Account"));

        String oldAvatarUrl = account.getAvatar();
        String newAvatarUrl;

        if (oldAvatarUrl != null && !oldAvatarUrl.isBlank()) {
            String oldImageId = Util.getImageIdFromUrl(oldAvatarUrl);
            newAvatarUrl = imageService.replaceImage(file, oldImageId);
        } else {
            newAvatarUrl = imageService.imagePath(file);
        }

        account.setAvatar(newAvatarUrl);
        accountRepository.save(account);
        return newAvatarUrl;
    }
}