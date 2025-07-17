import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { createConnection, Database } from '../src/database/connection.js';
import { initializeSchema } from '../src/database/schema.js';
import { RemoveTaskTool } from '../src/tools/removeTask.js';

describe('remove_task Tool', () => {
  let db: Database;
  let removeTaskTool: RemoveTaskTool;

  beforeEach(async () => {
    db = await createConnection(':memory:');
    await initializeSchema(db);
    removeTaskTool = new RemoveTaskTool(db);
  });

  afterEach(async () => {
    if (db) {
      try {
        await db.close();
      } catch (error) {
        // Ignore close errors in tests
      }
    }
  });

  test('should remove existing task', async () => {
    // First create a task
    const insertResult = await db.run(
      'INSERT INTO todos (title, description) VALUES (?, ?)',
      ['Test Task', 'Test Description']
    );
    const taskId = insertResult.lastID;

    // Remove the task
    const result = await removeTaskTool.execute({ input: { id: taskId } });

    expect(result.success).toBe(true);
    expect(result.message).toContain('Test Task');
    expect(result.message).toContain(`ID: ${taskId}`);
    expect(result.message).toContain('removed successfully');

    // Verify task is removed from database
    const deletedTask = await db.get('SELECT * FROM todos WHERE id = ?', [taskId]);
    expect(deletedTask).toBeUndefined();
  });

  test('should handle non-existent task', async () => {
    const nonExistentId = 999;
    const result = await removeTaskTool.execute({ input: { id: nonExistentId } });

    expect(result.success).toBe(false);
    expect(result.message).toContain(`Task with ID ${nonExistentId} not found`);
  });

  test('should validate task ID is a number', async () => {
    const result = await removeTaskTool.execute({ input: { id: 'not-a-number' } });

    expect(result.success).toBe(false);
    expect(result.message).toContain('Validation error');
  });

  test('should validate task ID is positive', async () => {
    const result = await removeTaskTool.execute({ input: { id: -1 } });

    expect(result.success).toBe(false);
    expect(result.message).toContain('Task ID must be positive');
  });

  test('should validate task ID is an integer', async () => {
    const result = await removeTaskTool.execute({ input: { id: 3.14 } });

    expect(result.success).toBe(false);
    expect(result.message).toContain('Task ID must be an integer');
  });

  test('should require task ID', async () => {
    const result = await removeTaskTool.execute({ input: {} });

    expect(result.success).toBe(false);
    expect(result.message).toContain('Validation error');
  });

  test('should handle multiple tasks and remove specific one', async () => {
    // Create multiple tasks
    const task1 = await db.run('INSERT INTO todos (title) VALUES (?)', ['Task 1']);
    const task2 = await db.run('INSERT INTO todos (title) VALUES (?)', ['Task 2']);
    const task3 = await db.run('INSERT INTO todos (title) VALUES (?)', ['Task 3']);

    // Remove middle task
    const result = await removeTaskTool.execute({ input: { id: task2.lastID } });

    expect(result.success).toBe(true);
    expect(result.message).toContain('Task 2');

    // Verify only task 2 is removed
    const remainingTasks = await db.all('SELECT * FROM todos ORDER BY id');
    expect(remainingTasks).toHaveLength(2);
    expect(remainingTasks[0].id).toBe(task1.lastID);
    expect(remainingTasks[1].id).toBe(task3.lastID);
  });

  test('should handle database errors gracefully', async () => {
    await db.close(); // Force database error
    db = null as any; // Prevent double close in afterEach
    
    const result = await removeTaskTool.execute({ input: { id: 1 } });

    expect(result.success).toBe(false);
    expect(result.message).toContain('Database error');
  });
});
