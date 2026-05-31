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
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminLogServiceImpl implements AdminLogService {

    private final AdminLogRepository adminLogRepository;
    private final AccountRepository accountRepository;
    private final AdminLogMapper adminLogMapper;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    @Override
    public void log(String adminId, String action, String targetId, String targetType, String detail) {
        try {
            Account admin = accountRepository.findByUsername(adminId)
                    .or(() -> accountRepository.findById(adminId))
                    .orElse(null);
            if (admin == null) {
                log.warn("AdminLog: could not find admin with id/username='{}', skipping log.", adminId);
                return;
            }
            AdminLog logEntry = AdminLog.builder()
                    .admin(admin)
                    .action(action)
                    .targetId(targetId)
                    .targetType(targetType)
                    .detail(detail)
                    .build();
            adminLogRepository.save(logEntry);
        } catch (Exception e) {
            log.error("AdminLog: failed to save log entry for action='{}', adminId='{}': {}", action, adminId, e.getMessage(), e);
        }
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