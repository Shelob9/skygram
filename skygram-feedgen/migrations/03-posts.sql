DROP TABLE IF EXISTS posts;
CREATE TABLE posts (
    uri TEXT NOT NULL,
    created DATETIME NOT NULL,
    feed_rkey TEXT,
    author_did TEXT NOT NULL,
);

CREATE INDEX idx_feed_rkey ON posts(feed_rkey);

CREATE UNIQUE INDEX idx_uri_feed_rkey ON posts(uri, feed_rkey);
