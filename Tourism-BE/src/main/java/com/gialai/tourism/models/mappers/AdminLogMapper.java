package com.gialai.tourism.models.mappers;

import com.gialai.tourism.models.dto.response.AdminLogResponse;
import com.gialai.tourism.models.entities.AdminLog;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AdminLogMapper {

    @Mapping(target = "adminId", source = "admin.id")
    @Mapping(target = "adminUsername", source = "admin.username")
    AdminLogResponse toResponse(AdminLog entity);
}