package com.gialai.tourism.models.dto.response;

import lombok.Builder;
import lombok.Data;
import java.util.Set;

@Data @Builder
public class UserRolesResponse {
    private String userId;
    private String username;
    private Set<String> roles;
}