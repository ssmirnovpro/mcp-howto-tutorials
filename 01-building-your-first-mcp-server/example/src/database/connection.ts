import sqlite3 from 'sqlite3';
import { promises as fs } from 'fs';
import { dirname } from 'path';

/**
 * Database wrapper with Promise-based API
 */
export class Database {
  private db: sqlite3.Database;

  constructor(db: sqlite3.Database) {
    this.db = db;
  }

  /**
   * Execute a SQL query that returns rows
   */
  async all<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(new Error(`Database query failed: ${err.message}`));
        } else {
          resolve(rows as T[]);
        }
      });
    });
  }

  /**
   * Execute a SQL query that returns a single row
   */
  async get<T = any>(sql: string, params: any[] = []): Promise<T | undefined> {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          reject(new Error(`Database query failed: ${err.message}`));
        } else {
          resolve(row as T | undefined);
        }
      });
    });
  }

  /**
   * Execute a SQL statement that doesn't return rows
   */
  async run(sql: string, params: any[] = []): Promise<{ lastID: number; changes: number }> {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) {
          reject(new Error(`Database operation failed: ${err.message}`));
        } else {
          resolve({ lastID: this.lastID, changes: this.changes });
        }
      });
    });
  }

  /**
   * Close the database connection
   */
  async close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) {
          reject(new Error(`Failed to close database: ${err.message}`));
        } else {
          resolve();
        }
      });
    });
  }
}

/**
 * Create a database connection
 */
export async function createConnection(dbPath: string): Promise<Database> {
  // Create directory if it doesn't exist (unless using :memory:)
  if (dbPath !== ':memory:') {
    try {
      const dir = dirname(dbPath);
      await fs.mkdir(dir, { recursive: true });
    } catch (error) {
      throw new Error(`Failed to create database directory: ${(error as Error).message}`);
    }
  }

  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        reject(new Error(`Failed to connect to database: ${err.message}`));
      } else {
        resolve(new Database(db));
      }
    });
  });
}
