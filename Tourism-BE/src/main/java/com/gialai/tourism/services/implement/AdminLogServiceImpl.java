package com.gialai.tourism.services.implement;

import com.gialai.tourism.models.dto.response.AdminLogResponse;
import com.gialai.tourism.models.dto.response.PageResponse;
import com.gialai.tourism.models.entities.Account;
import com.gialai.tourism.models.entities.AdminLog;
import com.gialai.tourism.models.mappers.AdminLogMapper;
import com.gialai.tourism.repositories.AdminLogRepository;
import com.gialai.tourism.repositories.AccountRepository;
import com.gialai.tourism.services.AdminLogService;
import com.gialai.tourism.specifications.AdminLogSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AdminLogServiceImpl implements AdminLogService {

    private final AdminLogRepository adminLogRepository;
    private final AccountRepository accountRepository;
    private final AdminLogMapper adminLogMapper;

    @Async
    @Override
    public void log(String adminId, String action, String targetId, String targetType, String detail) {
        Account admin = accountRepository.findById(adminId).orElse(null);
        if (admin == null) return;
        AdminLog logEntry = AdminLog.builder()
                .admin(admin)
                .action(action)
                .targetId(targetId)
                .targetType(targetType)
                .detail(detail)
                .build();
        adminLogRepository.save(logEntry);
    }

    @Override
    public PageResponse<AdminLogResponse> getLogs(String adminId, String action,
                                                  LocalDateTime fromDate, LocalDateTime toDate,
                                                  int page, int size) {
        Specification<AdminLog> spec = Specification.allOf(
                AdminLogSpecification.hasAdminId(adminId),
                AdminLogSpecification.hasAction(action),
                AdminLogSpecification.createdBetween(fromDate, toDate)
        );
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<AdminLog> logPage = adminLogRepository.findAll(spec, pageRequest);

        return PageResponse.<AdminLogResponse>builder()
                .content(logPage.map(adminLogMapper::toResponse).getContent())
                .page(logPage.getNumber())
                .size(logPage.getSize())
                .totalElements(logPage.getTotalElements())
                .totalPages(logPage.getTotalPages())
                .build();
    }
}