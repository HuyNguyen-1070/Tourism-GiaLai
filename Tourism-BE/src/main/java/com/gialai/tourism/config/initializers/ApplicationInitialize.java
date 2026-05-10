package com.gialai.tourism.config.initializers;

import com.gialai.tourism.enums.AuthProvider;
import com.gialai.tourism.enums.RoleType;
import com.gialai.tourism.models.entities.Account;
import com.gialai.tourism.models.entities.Role;
import com.gialai.tourism.services.AccountService;
import com.gialai.tourism.services.PasswordService;
import com.gialai.tourism.services.RoleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
public class ApplicationInitialize implements CommandLineRunner {

    private static final String ADMIN_EMAIL = "admin@gialaitourism.vn";
    private static final String ADMIN_USERNAME = "admin";
    private static final String ADMIN_PASSWORD = "Admin@123";
    private static final String ADMIN_FULL_NAME = "Administrator";

    private final AccountService accountService;
    private final RoleService roleService;
    private final PasswordService passwordService;

    @Override
    public void run(String... args) {
        try {
            Role adminRole = roleService.getByType(RoleType.ADMIN).orElse(null);
            if (adminRole == null) {
                log.warn("Admin role not found. Please run migration V2__insert_default_roles.sql first.");
                return;
            }

            if (!accountService.existsByUsername(ADMIN_USERNAME) && !accountService.existsByEmail(ADMIN_EMAIL)) {
                Account admin = new Account();
                admin.setFullName(ADMIN_FULL_NAME);
                admin.setUsername(ADMIN_USERNAME);
                admin.setEmail(ADMIN_EMAIL);
                admin.setPassword(passwordService.encryptPassword(ADMIN_PASSWORD));
                admin.setActive(true);
                admin.setProvider(AuthProvider.LOCAL);
                admin.setRoles(Set.of(adminRole));
                accountService.save(admin);
                log.info("Default admin account created: {}", ADMIN_USERNAME);
            }
        } catch (Exception e) {
            log.error("Failed to initialize default admin account", e);
        }
    }
}