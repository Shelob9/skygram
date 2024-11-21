CREATE TABLE posts (
    uri TEXT NOT NULL UNIQUE,
    created DATETIME NOT NULL,
    did TEXT NOT NULL
);

CREATE INDEX idx_did ON posts(did);
