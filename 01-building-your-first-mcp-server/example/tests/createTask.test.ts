import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { createConnection, Database } from '../src/database/connection.js';
import { initializeSchema } from '../src/database/schema.js';
import { CreateTaskTool } from '../src/tools/createTask.js';

describe('create_task Tool', () => {
  let db: Database;
  let createTaskTool: CreateTaskTool;

  beforeEach(async () => {
    db = await createConnection(':memory:');
    await initializeSchema(db);
    createTaskTool = new CreateTaskTool(db);
  });

  afterEach(async () => {
    await db.close();
  });

  test('should create task with title only', async () => {
    const input = { title: 'Buy milk' };

    const result = await createTaskTool.execute({ input });

    expect(result.success).toBe(true);
    expect(result.taskId).toBeGreaterThan(0);
    expect(result.message).toContain('created successfully');

    // Verify in database
    const task = await db.get('SELECT * FROM todos WHERE id = ?', [result.taskId]);
    expect(task.title).toBe(input.title);
    expect(task.description).toBeNull();
    expect(task.completed).toBe(0);
    expect(task.created_at).toBeDefined();
  });

  test('should create task with title and description', async () => {
    const input = {
      title: 'Grocery shopping',
      description: 'Buy milk, bread, and eggs from the store'
    };

    const result = await createTaskTool.execute({ input });

    expect(result.success).toBe(true);
    expect(result.taskId).toBeGreaterThan(0);

    const task = await db.get('SELECT * FROM todos WHERE id = ?', [result.taskId]);
    expect(task.title).toBe(input.title);
    expect(task.description).toBe(input.description);
  });

  test('should validate required title', async () => {
    const input = { title: '' };
    const result = await createTaskTool.execute({ input });

    expect(result.success).toBe(false);
    expect(result.message).toContain('Title is required');
  });

  test('should validate title is not only whitespace', async () => {
    const input = { title: '   ' };
    const result = await createTaskTool.execute({ input });

    expect(result.success).toBe(false);
    expect(result.message).toContain('Title cannot be empty');
  });

  test('should validate title length limit', async () => {
    const input = { title: 'a'.repeat(201) }; // Too long
    const result = await createTaskTool.execute({ input });

    expect(result.success).toBe(false);
    expect(result.message).toContain('Title too long');
  });

  test('should validate description length limit', async () => {
    const input = {
      title: 'Valid title',
      description: 'a'.repeat(1001) // Too long
    };
    const result = await createTaskTool.execute({ input });

    expect(result.success).toBe(false);
    expect(result.message).toContain('Description too long');
  });

  test('should trim whitespace from title', async () => {
    const input = { title: '  Buy groceries  ' };
    const result = await createTaskTool.execute({ input });

    expect(result.success).toBe(true);
    
    const task = await db.get('SELECT * FROM todos WHERE id = ?', [result.taskId]);
    expect(task.title).toBe('Buy groceries');
  });

  test('should handle special characters', async () => {
    const input = {
      title: 'Task with émojis 📝 and "quotes"',
      description: 'Description with\nnewlines and special chars: <>&'
    };
    const result = await createTaskTool.execute({ input });

    expect(result.success).toBe(true);
    
    const task = await db.get('SELECT * FROM todos WHERE id = ?', [result.taskId]);
    expect(task.title).toBe(input.title);
    expect(task.description).toBe(input.description);
  });

  test('should handle empty description as null', async () => {
    const input = { title: 'Task', description: '' };
    const result = await createTaskTool.execute({ input });

    expect(result.success).toBe(true);
    
    const task = await db.get('SELECT * FROM todos WHERE id = ?', [result.taskId]);
    expect(task.description).toBeNull();
  });
});
