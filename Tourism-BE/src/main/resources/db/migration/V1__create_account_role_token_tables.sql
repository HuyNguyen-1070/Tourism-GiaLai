-- Tạo bảng roles
CREATE TABLE roles (
                       id VARCHAR(20) NOT NULL,
                       name VARCHAR(255) NOT NULL,
                       description TEXT,
                       created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                       updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                       PRIMARY KEY (id),
                       UNIQUE KEY uk_roles_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tạo bảng accounts
CREATE TABLE accounts (
                          id VARCHAR(20) NOT NULL,
                          full_name NVARCHAR(100) NOT NULL,
                          username VARCHAR(30) NOT NULL,
                          email VARCHAR(50) NOT NULL,
                          password VARCHAR(60) NOT NULL,
                          avatar VARCHAR(255),
                          provider ENUM('LOCAL','GOOGLE','ZALO') DEFAULT 'LOCAL',
                          provider_id VARCHAR(100),
                          is_active BOOLEAN NOT NULL DEFAULT TRUE,
                          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                          PRIMARY KEY (id),
                          UNIQUE KEY uk_accounts_username (username),
                          UNIQUE KEY uk_accounts_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tạo bảng trung gian accounts_roles
CREATE TABLE accounts_roles (
                                account_id VARCHAR(20) NOT NULL,
                                role_id VARCHAR(20) NOT NULL,
                                PRIMARY KEY (account_id, role_id),
                                CONSTRAINT fk_accounts_roles_account FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE,
                                CONSTRAINT fk_accounts_roles_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tạo bảng refresh_tokens
CREATE TABLE refresh_tokens (
                                id VARCHAR(20) NOT NULL,
                                account_id VARCHAR(20) NOT NULL,
                                refresh_token VARCHAR(60) NOT NULL,
                                expired_time TIMESTAMP NULL,
                                is_revoked BOOLEAN NOT NULL DEFAULT FALSE,
                                revoked_at TIMESTAMP NULL,
                                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                PRIMARY KEY (id),
                                UNIQUE KEY uk_refresh_token_account (account_id),
                                UNIQUE KEY uk_refresh_token (refresh_token),
                                CONSTRAINT fk_refresh_tokens_account FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;