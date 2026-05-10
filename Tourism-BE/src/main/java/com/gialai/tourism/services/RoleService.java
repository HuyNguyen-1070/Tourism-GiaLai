package com.gialai.tourism.services;

import com.gialai.tourism.enums.RoleType;
import com.gialai.tourism.models.entities.Role;

import java.util.Optional;

public interface RoleService {
    Optional<Role> getByType(RoleType roleType);
}
