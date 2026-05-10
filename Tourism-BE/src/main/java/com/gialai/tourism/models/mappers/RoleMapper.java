package com.gialai.tourism.models.mappers;

import com.gialai.tourism.models.entities.Role;
import org.mapstruct.Mapper;

import java.util.Collections;
import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface RoleMapper {

    /**
     * Converts a Role entity to its enum name representation.
     * Used in ProfileMapper when mapping account.roles to DTO roles.
     *
     * @param role role entity
     * @return role name such as USER/ADMIN
     */
    default String toRoleName(Role role) {
        return role == null ? null : role.getName().name();
    }

    default Set<String> mapToNames(Set<Role> roles) {
        if (roles == null || roles.isEmpty()) {
            return Collections.emptySet();
        }
        return roles.stream()
                .map(role -> role.getName().name())
                .collect(Collectors.toSet());
    }
}