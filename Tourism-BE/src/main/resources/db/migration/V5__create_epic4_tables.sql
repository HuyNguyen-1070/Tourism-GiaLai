CREATE TABLE history_timelines (
                                   id VARCHAR(20) PRIMARY KEY,
                                   year INT NOT NULL,
                                   title VARCHAR(255) NOT NULL,
                                   description TEXT NOT NULL,
                                   location_name VARCHAR(255),
                                   image_url VARCHAR(500),
                                   related_post_id VARCHAR(20),
                                   display_order INT,
                                   created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                   updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                   CONSTRAINT fk_history_post FOREIGN KEY (related_post_id) REFERENCES posts(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE tourism_overview (
                                  id VARCHAR(20) PRIMARY KEY,
                                  highlights TEXT,
                                  revenue_last_year BIGINT,
                                  revenue_note VARCHAR(500),
                                  infrastructure_info TEXT,
                                  updated_by VARCHAR(20),
                                  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                  CONSTRAINT fk_overview_updater FOREIGN KEY (updated_by) REFERENCES accounts(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;