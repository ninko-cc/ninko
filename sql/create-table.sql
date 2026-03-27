CREATE TABLE access_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    accessed_at TEXT,
    path TEXT,
    ip TEXT,
    region TEXT,
    city TEXT,
    org TEXT,
    ua TEXT,
    referer TEXT
);