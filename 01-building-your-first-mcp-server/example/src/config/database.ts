import { homedir } from 'os';
import { join } from 'path';

/**
 * Expand tilde (~) to home directory if present
 */
function expandTilde(filePath: string): string {
  if (filePath.startsWith('~/')) {
    return join(homedir(), filePath.slice(2));
  }
  return filePath;
}

/**
 * Get the database path from environment variable
 * REQUIRED: TODO_DB_PATH environment variable must be set
 */
export function getDatabasePath(): string {
  const envPath = process.env.TODO_DB_PATH;
  if (!envPath) {
    throw new Error('TODO_DB_PATH environment variable is required. Please set it in your Claude Desktop configuration.');
  }
  return expandTilde(envPath);
}

// Remove the getDefaultDatabasePath function entirely
// No fallbacks - user must explicitly configure the path
