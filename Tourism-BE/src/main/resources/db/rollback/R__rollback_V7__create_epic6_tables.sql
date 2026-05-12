ALTER TABLE posts
DROP FOREIGN KEY IF EXISTS fk_posts_approved_by,
    DROP FOREIGN KEY IF EXISTS fk_posts_rejected_by,
    DROP COLUMN IF EXISTS rejection_reason,
    DROP COLUMN IF EXISTS approved_at,
    DROP COLUMN IF EXISTS rejected_at,
    DROP COLUMN IF EXISTS approved_by,
    DROP COLUMN IF EXISTS rejected_by;

DROP TABLE IF EXISTS admin_logs;
