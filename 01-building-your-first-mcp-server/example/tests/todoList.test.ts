import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { createConnection, Database } from '../src/database/connection.js';
import { initializeSchema } from '../src/database/schema.js';
import { TodoListTool } from '../src/tools/todoList.js';

describe('todo_list Tool', () => {
  let db: Database;
  let todoListTool: TodoListTool;

  beforeEach(async () => {
    db = await createConnection(':memory:');
    await initializeSchema(db);
    todoListTool = new TodoListTool(db);
  });

  afterEach(async () => {
    await db.close();
  });

  test('should return empty list when no todos', async () => {
    const result = await todoListTool.execute({ input: {} });

    expect(result.success).toBe(true);
    expect(result.todos).toEqual([]);
    expect(result.count).toBe(0);
    expect(result.message).toContain('No todos found');
  });

  test('should return all todos without filter', async () => {
    // Create test todos
    await db.run('INSERT INTO todos (title, description, completed) VALUES (?, ?, ?)', 
                 ['Task 1', 'Description 1', 0]);
    await db.run('INSERT INTO todos (title, description, completed) VALUES (?, ?, ?)', 
                 ['Task 2', null, 1]);
    await db.run('INSERT INTO todos (title, description, completed) VALUES (?, ?, ?)', 
                 ['Task 3', 'Description 3', 0]);

    const result = await todoListTool.execute({ input: {} });

    expect(result.success).toBe(true);
    expect(result.todos).toHaveLength(3);
    expect(result.count).toBe(3);
    expect(result.message).toContain('Found 3 todos');

    // Check structure of returned todos
    const firstTodo = result.todos?.[0];
    expect(firstTodo).toHaveProperty('id');
    expect(firstTodo).toHaveProperty('title');
    expect(firstTodo).toHaveProperty('description');
    expect(firstTodo).toHaveProperty('completed');
    expect(firstTodo).toHaveProperty('created_at');
  });

  test('should filter completed todos', async () => {
    await db.run('INSERT INTO todos (title, completed) VALUES (?, ?)', ['Task 1', 0]);
    await db.run('INSERT INTO todos (title, completed) VALUES (?, ?)', ['Task 2', 1]);
    await db.run('INSERT INTO todos (title, completed) VALUES (?, ?)', ['Task 3', 0]);

    const result = await todoListTool.execute({ input: { completed: true } });

    expect(result.success).toBe(true);
    expect(result.todos).toHaveLength(1);
    expect(result.count).toBe(1);
    expect(result.todos?.[0]?.title).toBe('Task 2');
    expect(result.todos?.[0]?.completed).toBe(true);
    expect(result.message).toContain('Found 1 completed todo');
  });

  test('should filter active todos', async () => {
    await db.run('INSERT INTO todos (title, completed) VALUES (?, ?)', ['Task 1', 0]);
    await db.run('INSERT INTO todos (title, completed) VALUES (?, ?)', ['Task 2', 1]);
    await db.run('INSERT INTO todos (title, completed) VALUES (?, ?)', ['Task 3', 0]);

    const result = await todoListTool.execute({ input: { completed: false } });

    expect(result.success).toBe(true);
    expect(result.todos).toHaveLength(2);
    expect(result.count).toBe(2);
    expect(result.todos?.every(todo => !todo.completed)).toBe(true);
    expect(result.message).toContain('Found 2 active todos');
  });

  test('should order todos by creation date (newest first)', async () => {
    await db.run('INSERT INTO todos (title, created_at) VALUES (?, ?)', 
                 ['First task', '2024-01-01 10:00:00']);
    await db.run('INSERT INTO todos (title, created_at) VALUES (?, ?)', 
                 ['Latest task', '2024-01-01 12:00:00']);
    await db.run('INSERT INTO todos (title, created_at) VALUES (?, ?)', 
                 ['Middle task', '2024-01-01 11:00:00']);

    const result = await todoListTool.execute({ input: {} });

    expect(result.success).toBe(true);
    expect(result.todos?.[0]?.title).toBe('Latest task');
    expect(result.todos?.[1]?.title).toBe('Middle task');
    expect(result.todos?.[2]?.title).toBe('First task');
  });

  test('should convert SQLite boolean to JavaScript boolean', async () => {
    await db.run('INSERT INTO todos (title, completed) VALUES (?, ?)', ['Task', 1]);

    const result = await todoListTool.execute({ input: {} });

    expect(result.success).toBe(true);
    expect(result.todos?.[0]?.completed).toBe(true); // Not 1
  });

  test('should handle null descriptions correctly', async () => {
    await db.run('INSERT INTO todos (title, description) VALUES (?, ?)', ['Task', null]);

    const result = await todoListTool.execute({ input: {} });

    expect(result.success).toBe(true);
    expect(result.todos?.[0]?.description).toBeNull();
  });

  test('should validate completed parameter', async () => {
    const result = await todoListTool.execute({ 
      input: { completed: 'invalid' as any } 
    });

    expect(result.success).toBe(false);
    expect(result.message).toContain('Invalid completed filter');
  });
});
