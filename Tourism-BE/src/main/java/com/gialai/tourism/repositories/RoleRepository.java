package com.gialai.tourism.repositories;

import com.gialai.tourism.enums.RoleType;
import com.gialai.tourism.models.entities.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, String> {
    Optional<Role> findByName(RoleType name);
}