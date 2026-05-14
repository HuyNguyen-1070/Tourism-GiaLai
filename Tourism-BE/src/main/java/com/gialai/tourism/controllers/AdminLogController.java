package com.gialai.tourism.controllers;

import com.gialai.tourism.common.base.ApiResponse;
import com.gialai.tourism.models.dto.response.AdminLogResponse;
import com.gialai.tourism.models.dto.response.PageResponse;
import com.gialai.tourism.services.AdminLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/admin/logs")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ADMIN')")
public class AdminLogController {

    private final AdminLogService adminLogService;

    @GetMapping
    public ApiResponse getLogs(@RequestParam(required = false) String adminId,
                               @RequestParam(required = false) String action,
                               @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fromDate,
                               @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime toDate,
                               @RequestParam(defaultValue = "0") int page,
                               @RequestParam(defaultValue = "20") int size) {
        PageResponse<AdminLogResponse> data = adminLogService.getLogs(adminId, action, fromDate, toDate, page, size);
        return new ApiResponse(200, "OK", "Admin logs fetched successfully", data);
    }
}