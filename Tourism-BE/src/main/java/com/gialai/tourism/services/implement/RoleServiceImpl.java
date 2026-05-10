package com.gialai.tourism.services.implement;

import com.gialai.tourism.enums.RoleType;
import com.gialai.tourism.models.entities.Role;
import com.gialai.tourism.repositories.RoleRepository;
import com.gialai.tourism.services.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RoleServiceImpl implements RoleService {
    private final RoleRepository roleRepository;

    @Override
    public Optional<Role> getByType(RoleType roleType) {
        return roleRepository.findByName(roleType);
    }
}
