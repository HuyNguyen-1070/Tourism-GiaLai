CREATE TABLE post_likes (
                            id VARCHAR(20) PRIMARY KEY,
                            post_id VARCHAR(20) NOT NULL,
                            account_id VARCHAR(20) NOT NULL,
                            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                            updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                            CONSTRAINT fk_post_likes_post FOREIGN KEY (post_id) REFERENCES posts(id),
                            CONSTRAINT fk_post_likes_account FOREIGN KEY (account_id) REFERENCES accounts(id),
                            UNIQUE KEY uk_post_likes_post_account (post_id, account_id)
);

CREATE TABLE post_favorites (
                                id VARCHAR(20) PRIMARY KEY,
                                post_id VARCHAR(20) NOT NULL,
                                account_id VARCHAR(20) NOT NULL,
                                created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                CONSTRAINT fk_post_favorites_post FOREIGN KEY (post_id) REFERENCES posts(id),
                                CONSTRAINT fk_post_favorites_account FOREIGN KEY (account_id) REFERENCES accounts(id),
                                UNIQUE KEY uk_post_favorites_post_account (post_id, account_id)
);

CREATE TABLE comments (
                          id VARCHAR(20) PRIMARY KEY,
                          post_id VARCHAR(20) NOT NULL,
                          author_id VARCHAR(20) NOT NULL,
                          content TEXT NOT NULL,
                          is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
                          created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                          updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                          CONSTRAINT fk_comments_post FOREIGN KEY (post_id) REFERENCES posts(id),
                          CONSTRAINT fk_comments_author FOREIGN KEY (author_id) REFERENCES accounts(id)
);

CREATE TABLE ratings (
                         id VARCHAR(20) PRIMARY KEY,
                         post_id VARCHAR(20) NOT NULL,
                         account_id VARCHAR(20) NOT NULL,
                         score DECIMAL(2,1) NOT NULL,
                         created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                         updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                         CONSTRAINT fk_ratings_post FOREIGN KEY (post_id) REFERENCES posts(id),
                         CONSTRAINT fk_ratings_account FOREIGN KEY (account_id) REFERENCES accounts(id),
                         UNIQUE KEY uk_ratings_post_account (post_id, account_id)
);