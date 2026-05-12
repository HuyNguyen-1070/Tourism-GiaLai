package com.gialai.tourism.models.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class AssignRoleRequest {
    @NotBlank(message = "roleName is required")
    private String roleName;

    @NotBlank(message = "action is required")
    @Pattern(regexp = "GRANT|REVOKE", message = "action must be GRANT or REVOKE")
    private String action;
}