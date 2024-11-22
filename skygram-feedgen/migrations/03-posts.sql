DROP TABLE IF EXISTS posts;
CREATE TABLE posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uri TEXT NOT NULL,
    created DATETIME NOT NULL,
    feed_rkey TEXT,
    author_did TEXT NOT NULL
);

CREATE INDEX idx_feed_rkey ON posts(feed_rkey);
CREATE INDEX idx_author_did ON posts(author_did);

CREATE UNIQUE INDEX idx_uri_feed_rkey ON posts(uri, feed_rkey);
