package com.gialai.tourism.models.mappers;

import com.gialai.tourism.models.dto.ProfileDTO;
import com.gialai.tourism.models.entities.Account;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = RoleMapper.class)
public interface ProfileMapper {

    @Mapping(source = "roles", target = "roles", qualifiedByName = "mapRoleNames")
    ProfileDTO toProfileDTO(Account account);
}