package com.gialai.tourism.services.implement;

import com.gialai.tourism.enums.ErrorCode;
import com.gialai.tourism.enums.PostStatus;
import com.gialai.tourism.enums.RoleType;
import com.gialai.tourism.exceptions.AppException;
import com.gialai.tourism.models.dto.response.*;
import com.gialai.tourism.models.entities.Account;
import com.gialai.tourism.models.entities.Role;
import com.gialai.tourism.repositories.AccountRepository;
import com.gialai.tourism.repositories.PostRepository;
import com.gialai.tourism.repositories.RefreshTokenRepository;
import com.gialai.tourism.repositories.RoleRepository;
import com.gialai.tourism.services.AdminLogService;
import com.gialai.tourism.services.AdminUserService;
import com.gialai.tourism.specifications.AccountSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminUserServiceImpl implements AdminUserService {

    private final AccountRepository accountRepository;
    private final PostRepository postRepository;
    private final RoleRepository roleRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final AdminLogService adminLogService;

    @Override
    public PageResponse<UserSummaryResponse> getUsers(String keyword, Boolean isActive, String role,
                                                      String sortField, String direction,
                                                      int page, int size) {
        Specification<Account> spec = Specification.allOf(
                AccountSpecification.hasKeyword(keyword),
                AccountSpecification.isActive(isActive),
                AccountSpecification.hasRole(role)
        );

        Sort sort = buildSort(sortField, direction);
        PageRequest pageRequest = PageRequest.of(page, size, sort);
        Page<Account> accounts = accountRepository.findAll(spec, pageRequest);

        Page<UserSummaryResponse> userPage = accounts.map(acc -> {
            Set<String> roles = acc.getRoles().stream()
                    .map(r -> r.getName().name())
                    .collect(Collectors.toSet());
            int postCount = (int) postRepository.countByAuthorId(acc.getId());
            return UserSummaryResponse.builder()
                    .id(acc.getId())
                    .fullName(acc.getFullName())
                    .username(acc.getUsername())
                    .email(acc.getEmail())
                    .avatar(acc.getAvatar())
                    .provider(acc.getProvider().name())
                    .isActive(acc.isActive())
                    .roles(roles)
                    .postCount(postCount)
                    .createdAt(acc.getCreatedAt())
                    .build();
        });

        return PageResponse.<UserSummaryResponse>builder()
                .content(userPage.getContent())
                .page(userPage.getNumber())
                .size(userPage.getSize())
                .totalElements(userPage.getTotalElements())
                .totalPages(userPage.getTotalPages())
                .build();
    }

    @Override
    public UserDetailResponse getUserDetail(String userId) {
        Account account = accountRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND, "User"));
        long totalPosts = postRepository.countByAuthorIdAndStatusNot(account.getId(), PostStatus.DELETED);
        long approved = postRepository.countByAuthorIdAndStatus(account.getId(), PostStatus.APPROVED);
        long pending = postRepository.countByAuthorIdAndStatus(account.getId(), PostStatus.PENDING);
        long rejected = postRepository.countByAuthorIdAndStatus(account.getId(), PostStatus.REJECTED);

        return UserDetailResponse.builder()
                .id(account.getId())
                .fullName(account.getFullName())
                .username(account.getUsername())
                .email(account.getEmail())
                .avatar(account.getAvatar())
                .provider(account.getProvider().name())
                .isActive(account.isActive())
                .roles(account.getRoles().stream()
                        .map(r -> r.getName().name())
                        .collect(Collectors.toSet()))
                .stats(UserDetailResponse.UserStats.builder()
                        .totalPosts((int) totalPosts)
                        .approvedPosts((int) approved)
                        .pendingPosts((int) pending)
                        .rejectedPosts((int) rejected)
                        .build())
                .createdAt(account.getCreatedAt())
                .updatedAt(account.getUpdatedAt())
                .build();
    }

    @Transactional
    @Override
    public ToggleActiveResponse toggleActive(String userId, String adminId) {
        if (userId.equals(adminId)) {
            throw new AppException(ErrorCode.VALIDATION_ERROR, "Admin cannot lock their own account");
        }
        Account target = accountRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND, "User"));
        if (target.getRoles().stream().anyMatch(r -> r.getName() == RoleType.ADMIN)) {
            throw new AppException(ErrorCode.UNAUTHORIZED, "Cannot lock another Admin account");
        }

        target.setActive(!target.isActive());
        accountRepository.save(target);

        if (!target.isActive()) {
            refreshTokenRepository.revokeAllByAccountId(userId);
        }

        String action = target.isActive() ? "UNLOCK_USER" : "LOCK_USER";
        adminLogService.log(adminId, action, userId, "USER", "User: " + target.getUsername());

        return ToggleActiveResponse.builder()
                .userId(target.getId())
                .username(target.getUsername())
                .isActive(target.isActive())
                .updatedAt(target.getUpdatedAt())
                .build();
    }

    @Transactional
    @Override
    public UserRolesResponse assignRole(String userId, String roleName, String action, String adminId) {
        Account target = accountRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND, "User"));
        RoleType roleType = RoleType.valueOf(roleName.toUpperCase());
        Role role = roleRepository.findByName(roleType)
                .orElseThrow(() -> new AppException(ErrorCode.VALIDATION_ERROR, "Invalid role: " + roleName));

        boolean isGrant = "GRANT".equalsIgnoreCase(action);
        if (isGrant) {
            target.getRoles().add(role);
        } else {
            if (roleType == RoleType.ADMIN && userId.equals(adminId)) {
                throw new AppException(ErrorCode.VALIDATION_ERROR, "Admin cannot revoke own ADMIN role");
            }
            target.getRoles().remove(role);
        }
        accountRepository.save(target);

        String logAction = isGrant ? "GRANT_ROLE" : "REVOKE_ROLE";
        adminLogService.log(adminId, logAction, userId, "USER",
                String.format("%s role %s for user %s", action, roleName, target.getUsername()));

        Set<String> roles = target.getRoles().stream()
                .map(r -> r.getName().name())
                .collect(Collectors.toSet());

        return UserRolesResponse.builder()
                .userId(target.getId())
                .username(target.getUsername())
                .roles(roles)
                .build();
    }

    private Sort buildSort(String sortField, String direction) {
        if (sortField == null || sortField.isBlank()) {
            sortField = "createdAt";
        }
        Sort.Direction dir = Sort.Direction.fromString(direction != null ? direction.toLowerCase() : "desc");
        return Sort.by(dir, sortField);
    }
}