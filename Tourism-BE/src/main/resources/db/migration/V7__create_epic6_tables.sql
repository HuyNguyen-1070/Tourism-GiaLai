CREATE TABLE IF NOT EXISTS admin_logs (
                                          id VARCHAR(20) PRIMARY KEY,
    admin_id VARCHAR(20) NOT NULL,
    action VARCHAR(50) NOT NULL,
    target_id VARCHAR(20),
    target_type VARCHAR(50),
    detail TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_admin_logs_admin FOREIGN KEY (admin_id) REFERENCES accounts(id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET @col_exists = (SELECT COUNT(*) FROM information_schema.columns
                   WHERE table_schema = DATABASE() AND table_name = 'posts' AND column_name = 'rejection_reason');
SET @sql = IF(@col_exists = 0, 'ALTER TABLE posts ADD COLUMN rejection_reason TEXT', 'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @col_exists = (SELECT COUNT(*) FROM information_schema.columns
                   WHERE table_schema = DATABASE() AND table_name = 'posts' AND column_name = 'approved_at');
SET @sql = IF(@col_exists = 0, 'ALTER TABLE posts ADD COLUMN approved_at DATETIME', 'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @col_exists = (SELECT COUNT(*) FROM information_schema.columns
                   WHERE table_schema = DATABASE() AND table_name = 'posts' AND column_name = 'rejected_at');
SET @sql = IF(@col_exists = 0, 'ALTER TABLE posts ADD COLUMN rejected_at DATETIME', 'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @col_exists = (SELECT COUNT(*) FROM information_schema.columns
                   WHERE table_schema = DATABASE() AND table_name = 'posts' AND column_name = 'approved_by');
SET @sql = IF(@col_exists = 0, 'ALTER TABLE posts ADD COLUMN approved_by VARCHAR(20)', 'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @col_exists = (SELECT COUNT(*) FROM information_schema.columns
                   WHERE table_schema = DATABASE() AND table_name = 'posts' AND column_name = 'rejected_by');
SET @sql = IF(@col_exists = 0, 'ALTER TABLE posts ADD COLUMN rejected_by VARCHAR(20)', 'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

DELIMITER //
CREATE PROCEDURE add_fk_if_not_exists()
BEGIN
    IF NOT EXISTS (SELECT * FROM information_schema.key_column_usage
                   WHERE table_schema = DATABASE() AND table_name = 'posts' AND constraint_name = 'fk_posts_approved_by') THEN
ALTER TABLE posts ADD CONSTRAINT fk_posts_approved_by FOREIGN KEY (approved_by) REFERENCES accounts(id);
END IF;
    IF NOT EXISTS (SELECT * FROM information_schema.key_column_usage
                   WHERE table_schema = DATABASE() AND table_name = 'posts' AND constraint_name = 'fk_posts_rejected_by') THEN
ALTER TABLE posts ADD CONSTRAINT fk_posts_rejected_by FOREIGN KEY (rejected_by) REFERENCES accounts(id);
END IF;
END //
DELIMITER ;

CALL add_fk_if_not_exists();
DROP PROCEDURE add_fk_if_not_exists;