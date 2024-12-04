DROP TABLE IF EXISTS posts;
CREATE TABLE posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created DATETIME NOT NULL,
    did VARCHAR(255) NOT NULL,
    rkey VARCHAR(255) NOT NULL
);

CREATE INDEX idx_author_did ON posts(did);

CREATE UNIQUE INDEX idx_unique_did_rkey ON posts(did, rkey);
