import { describe, test, expect, afterEach } from '@jest/globals';
import { createConnection, Database } from '../src/database/connection.js';
import { initializeSchema } from '../src/database/schema.js';
import { getDatabasePath } from '../src/config/database.js';
import { existsSync, unlinkSync } from 'fs';
import { homedir } from 'os';

describe('Database Connection', () => {
  let db: Database;

  afterEach(async () => {
    if (db) {
      try {
        await db.close();
      } catch (error) {
        // Ignore close errors in tests
      }
    }
  });

  test('should require TODO_DB_PATH environment variable', () => {
    delete process.env.TODO_DB_PATH;
    
    expect(() => getDatabasePath()).toThrow('TODO_DB_PATH environment variable is required');
  });

  test('should expand tilde in custom database path', () => {
    const customPath = '~/custom-todos.db';
    process.env.TODO_DB_PATH = customPath;
    
    const dbPath = getDatabasePath();
    
    expect(dbPath).toBe(`${homedir()}/custom-todos.db`);
    expect(dbPath).not.toContain('~');
  });

  test('should use custom database path from environment variable', () => {
    const customPath = '/tmp/custom-todos.db';
    process.env.TODO_DB_PATH = customPath;
    
    const dbPath = getDatabasePath();
    
    expect(dbPath).toBe(customPath);
  });

  test('should create database file', async () => {
    const dbPath = './test-todos.db';
    db = await createConnection(dbPath);
    
    expect(existsSync(dbPath)).toBe(true);
    
    // Close and cleanup
    await db.close();
    db = null as any; // Prevent double close in afterEach
    unlinkSync(dbPath);
  });

  test('should initialize todos table with correct schema', async () => {
    db = await createConnection(':memory:');
    await initializeSchema(db);
    
    const tableInfo = await db.all("PRAGMA table_info(todos)");
    
    expect(tableInfo).toHaveLength(5);
    expect(tableInfo.find((col: any) => col.name === 'id')?.pk).toBe(1);
    expect(tableInfo.find((col: any) => col.name === 'title')?.notnull).toBe(1);
    expect(tableInfo.find((col: any) => col.name === 'description')?.notnull).toBe(0);
    expect(tableInfo.find((col: any) => col.name === 'completed')).toBeDefined();
    expect(tableInfo.find((col: any) => col.name === 'created_at')).toBeDefined();
  });

  test('should set correct default values', async () => {
    db = await createConnection(':memory:');
    await initializeSchema(db);
    
    // Insert minimal todo
    await db.run('INSERT INTO todos (title) VALUES (?)', ['Test Todo']);
    const todo = await db.get('SELECT * FROM todos WHERE id = 1');
    
    expect(todo.completed).toBe(0); // SQLite stores boolean as 0/1
    expect(todo.created_at).toBeDefined();
    expect(todo.description).toBeNull();
  });

  test('should handle connection errors gracefully', async () => {
    await expect(createConnection('/invalid/path/todos.db'))
      .rejects.toThrow();
  });

  test('should handle basic database operations', async () => {
    db = await createConnection(':memory:');
    await initializeSchema(db);
    
    // Test insert
    const result = await db.run('INSERT INTO todos (title, description) VALUES (?, ?)', 
                                ['Test', 'Description']);
    expect(result.lastID).toBeGreaterThan(0);
    
    // Test select
    const todo = await db.get('SELECT * FROM todos WHERE id = ?', [result.lastID]);
    expect(todo?.title).toBe('Test');
    
    // Test list
    const todos = await db.all('SELECT * FROM todos');
    expect(todos).toHaveLength(1);
  });
});
