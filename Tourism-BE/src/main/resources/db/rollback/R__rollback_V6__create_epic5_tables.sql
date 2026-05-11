DROP TABLE IF EXISTS post_tags;

DROP TABLE IF EXISTS locations;

DROP TABLE IF EXISTS tags;

CREATE TABLE post_tags (
                           post_id VARCHAR(20) NOT NULL,
                           tag ENUM('LOCATION','CULTURE','HISTORY','FESTIVAL','FOOD','ACCOMMODATION','TRANSPORT') NOT NULL,
                           PRIMARY KEY (post_id, tag),
                           CONSTRAINT fk_post_tags_post_old FOREIGN KEY (post_id) REFERENCES posts(id)
);