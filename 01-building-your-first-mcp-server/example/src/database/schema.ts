import { Database } from './connection.js';

/**
 * Initialize the database schema
 */
export async function initializeSchema(db: Database): Promise<void> {
  try {
    // Define schema directly instead of reading from file for better compatibility
    const schemaSql = `
      CREATE TABLE IF NOT EXISTS todos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL CHECK(length(trim(title)) > 0),
          description TEXT,
          completed BOOLEAN DEFAULT FALSE,
          created_at DATETIME DEFAULT (datetime('now', 'localtime'))
      );

      CREATE INDEX IF NOT EXISTS idx_todos_completed ON todos(completed);
      CREATE INDEX IF NOT EXISTS idx_todos_created_at ON todos(created_at);
    `;

    // Split and execute each statement
    const statements = schemaSql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    for (const statement of statements) {
      await db.run(statement);
    }
  } catch (error) {
    throw new Error(`Failed to initialize database schema: ${(error as Error).message}`);
  }
}
