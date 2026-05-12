package com.gialai.tourism.services;

import com.gialai.tourism.models.dto.response.PageResponse;
import com.gialai.tourism.models.dto.response.AdminLogResponse;
import org.springframework.scheduling.annotation.Async;

import java.time.LocalDateTime;

public interface AdminLogService {
    @Async
    void log(String adminId, String action, String targetId, String targetType, String detail);

    PageResponse<AdminLogResponse> getLogs(String adminId, String action,
                                           LocalDateTime fromDate, LocalDateTime toDate,
                                           int page, int size);
}