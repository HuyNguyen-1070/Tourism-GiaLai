START TRANSACTION;

CREATE TABLE IF NOT EXISTS tags (
                                    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_tags_name (name)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS locations (
                                         id VARCHAR(20) PRIMARY KEY,
    post_id VARCHAR(20) NOT NULL,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(500),
    latitude DOUBLE NOT NULL,
    longitude DOUBLE NOT NULL,
    public_id VARCHAR(255),
    place_id VARCHAR(255),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_locations_post FOREIGN KEY (post_id) REFERENCES posts(id),
    UNIQUE KEY uk_locations_post_id (post_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET @table_exists = (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'post_tags');
SET @column_exists = (SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'post_tags' AND column_name = 'tag_id');

SET @drop_needed = @table_exists AND NOT @column_exists;

SET @sql_drop = IF(@drop_needed, 'DROP TABLE post_tags', 'SELECT 1');
PREPARE stmt_drop FROM @sql_drop;
EXECUTE stmt_drop;
DEALLOCATE PREPARE stmt_drop;

CREATE TABLE IF NOT EXISTS post_tags (
                                         post_id VARCHAR(20) NOT NULL,
    tag_id VARCHAR(20) NOT NULL,
    PRIMARY KEY (post_id, tag_id),
    CONSTRAINT fk_post_tags_post FOREIGN KEY (post_id) REFERENCES posts(id),
    CONSTRAINT fk_post_tags_tag FOREIGN KEY (tag_id) REFERENCES tags(id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

COMMIT;