CREATE TABLE posts (
                       id VARCHAR(20) NOT NULL,
                       title VARCHAR(255) NOT NULL,
                       content TEXT NOT NULL,
                       summary VARCHAR(500),
                       source_type VARCHAR(10) NOT NULL,
                       source_name VARCHAR(255),
                       status VARCHAR(15) NOT NULL DEFAULT 'PENDING',
                       author_id VARCHAR(20) NOT NULL,
                       view_count BIGINT NOT NULL DEFAULT 0,
                       like_count BIGINT NOT NULL DEFAULT 0,
                       favorite_count BIGINT NOT NULL DEFAULT 0,
                       average_rating DOUBLE NOT NULL DEFAULT 0.0,
                       rating_count INT NOT NULL DEFAULT 0,
                       approved_at TIMESTAMP NULL,
                       rejected_at TIMESTAMP NULL,
                       approved_by VARCHAR(20),
                       rejected_by VARCHAR(20),
                       rejection_reason VARCHAR(500),
                       created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                       updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                       PRIMARY KEY (id),
                       CONSTRAINT fk_posts_author FOREIGN KEY (author_id) REFERENCES accounts(id) ON DELETE CASCADE,
                       CONSTRAINT fk_posts_approved_by FOREIGN KEY (approved_by) REFERENCES accounts(id) ON DELETE SET NULL,
                       CONSTRAINT fk_posts_rejected_by FOREIGN KEY (rejected_by) REFERENCES accounts(id) ON DELETE SET NULL,
                       INDEX idx_posts_status (status),
                       INDEX idx_posts_author (author_id),
                       INDEX idx_posts_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tạo bảng post_images (1-N)
CREATE TABLE post_images (
                             post_id VARCHAR(20) NOT NULL,
                             image_url VARCHAR(512) NOT NULL,
                             PRIMARY KEY (post_id, image_url),
                             CONSTRAINT fk_post_images_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tạo bảng post_tags (1-N)
CREATE TABLE post_tags (
                           post_id VARCHAR(20) NOT NULL,
                           tag VARCHAR(30) NOT NULL,
                           PRIMARY KEY (post_id, tag),
                           CONSTRAINT fk_post_tags_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tạo bảng notifications
CREATE TABLE notifications (
                               id VARCHAR(20) NOT NULL,
                               type VARCHAR(20) NOT NULL,
                               message VARCHAR(1000) NOT NULL,
                               is_read BOOLEAN NOT NULL DEFAULT FALSE,
                               related_post_id VARCHAR(20),
                               recipient_id VARCHAR(20) NOT NULL,
                               created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                               updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                               PRIMARY KEY (id),
                               CONSTRAINT fk_notifications_recipient FOREIGN KEY (recipient_id) REFERENCES accounts(id) ON DELETE CASCADE,
                               INDEX idx_notifications_recipient (recipient_id),
                               INDEX idx_notifications_read (is_read)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;