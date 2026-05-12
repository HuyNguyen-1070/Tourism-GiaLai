package com.gialai.tourism.services;

import com.gialai.tourism.models.dto.response.*;

public interface AdminUserService {
    PageResponse<UserSummaryResponse> getUsers(String keyword, Boolean isActive, String role,
                                               String sortField, String direction,
                                               int page, int size);
    UserDetailResponse getUserDetail(String userId);
    ToggleActiveResponse toggleActive(String userId, String adminId);
    UserRolesResponse assignRole(String userId, String roleName, String action, String adminId);
}