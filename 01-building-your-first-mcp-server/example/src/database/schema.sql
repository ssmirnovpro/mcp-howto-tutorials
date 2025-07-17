-- Todo table schema for MCP Todo Manager
-- Creates a simple table for storing TODO items

CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL CHECK(length(trim(title)) > 0),
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT (datetime('now', 'localtime'))
);

-- Index for faster queries on completion status
CREATE INDEX IF NOT EXISTS idx_todos_completed ON todos(completed);

-- Index for faster queries on creation date
CREATE INDEX IF NOT EXISTS idx_todos_created_at ON todos(created_at);
