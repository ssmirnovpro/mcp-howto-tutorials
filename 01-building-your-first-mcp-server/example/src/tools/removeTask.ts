import { z } from 'zod';
import { Database } from '../database/connection.js';
import { RemoveTaskResult, ToolContext } from '../types.js';
import { loadToolDescription } from '../tool-loader.js';

/**
 * Validation schema for remove_task input
 */
const RemoveTaskSchema = z.object({
  id: z
    .number()
    .int('Task ID must be an integer')
    .positive('Task ID must be positive')
});

/**
 * Remove Task tool implementation
 */
export class RemoveTaskTool {
  constructor(private db: Database) {}

  /**
   * Execute the remove_task tool
   */
  async execute(context: ToolContext): Promise<RemoveTaskResult> {
    try {
      // Validate input
      const validationResult = RemoveTaskSchema.safeParse(context.input);
      
      if (!validationResult.success) {
        const errors = validationResult.error.errors
          .map(err => err.message)
          .join(', ');
        return {
          success: false,
          message: `Validation error: ${errors}`
        };
      }

      const { id } = validationResult.data;

      // Check if task exists
      const existingTask = await this.db.get(
        'SELECT id, title FROM todos WHERE id = ?',
        [id]
      );

      if (!existingTask) {
        return {
          success: false,
          message: `Task with ID ${id} not found`
        };
      }

      // Delete the task
      const result = await this.db.run(
        'DELETE FROM todos WHERE id = ?',
        [id]
      );

      if (result.changes === 0) {
        return {
          success: false,
          message: `Failed to remove task with ID ${id}`
        };
      }

      return {
        success: true,
        message: `Task "${existingTask.title}" (ID: ${id}) removed successfully`
      };

    } catch (error) {
      console.error('Remove task error:', error);
      return {
        success: false,
        message: `Database error: ${(error as Error).message}`
      };
    }
  }

  /**
   * Get tool definition for MCP
   */
  static getDefinition() {
    return {
      name: 'remove_task',
      description: loadToolDescription('remove_task'),
      inputSchema: {
        type: 'object',
        properties: {
          id: {
            type: 'number',
            description: 'The ID of the task to remove',
            minimum: 1
          }
        },
        required: ['id']
      }
    };
  }
}
