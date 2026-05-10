package com.gialai.tourism.services.implement;

import com.gialai.tourism.enums.NotificationType;
import com.gialai.tourism.enums.RoleType;
import com.gialai.tourism.exceptions.AppException;
import com.gialai.tourism.enums.ErrorCode;
import com.gialai.tourism.models.dto.response.NotificationResponse;
import com.gialai.tourism.models.dto.response.PageResponse;
import com.gialai.tourism.models.entities.Account;
import com.gialai.tourism.models.entities.Notification;
import com.gialai.tourism.repositories.AccountRepository;
import com.gialai.tourism.repositories.NotificationRepository;
import com.gialai.tourism.services.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final AccountRepository accountRepository;

    @Async
    @Override
    public void notifyAdmins(String message, String postId, NotificationType type) {
        List<Account> admins = accountRepository.findByRoles_Name(RoleType.ADMIN);
        for (Account admin : admins) {
            Notification notif = Notification.builder()
                    .type(type)
                    .message(message)
                    .isRead(false)
                    .relatedPostId(postId)
                    .recipient(admin)
                    .build();
            notificationRepository.save(notif);
        }
    }

    @Async
    @Override
    public void notifyUser(String email, String message, String postId, NotificationType type) {
        accountRepository.findByEmail(email).ifPresent(account -> {
            Notification notif = Notification.builder()
                    .type(type)
                    .message(message)
                    .isRead(false)
                    .relatedPostId(postId)
                    .recipient(account)
                    .build();
            notificationRepository.save(notif);
        });
    }

    @Override
    public PageResponse<NotificationResponse> getUserNotifications(String username, int page, int size, Boolean isRead) {
        Account user = accountRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND, "Account"));
        Page<Notification> notifPage;
        PageRequest pageRequest = PageRequest.of(page, size);
        if (isRead != null) {
            notifPage = notificationRepository.findByRecipientIdAndIsReadOrderByCreatedAtDesc(user.getId(), isRead, pageRequest);
        } else {
            notifPage = notificationRepository.findByRecipientIdOrderByCreatedAtDesc(user.getId(), pageRequest);
        }
        return PageResponse.<NotificationResponse>builder()
                .content(notifPage.map(n -> NotificationResponse.builder()
                        .id(n.getId())
                        .type(n.getType())
                        .message(n.getMessage())
                        .isRead(n.isRead())
                        .relatedPostId(n.getRelatedPostId())
                        .createdAt(n.getCreatedAt())
                        .build()).getContent())
                .page(notifPage.getNumber())
                .size(notifPage.getSize())
                .totalElements(notifPage.getTotalElements())
                .totalPages(notifPage.getTotalPages())
                .build();
    }

    @Transactional
    @Override
    public void markAsRead(String notificationId, String username) {
        Notification notif = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND, "Notification"));
        if (!notif.getRecipient().getUsername().equals(username)) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        notif.setRead(true);
        notificationRepository.save(notif);
    }
}