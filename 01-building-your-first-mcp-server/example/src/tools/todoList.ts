import { z } from 'zod';
import { Database } from '../database/connection.js';
import { Todo, TodoListResult, ToolContext } from '../types.js';
import { loadToolDescription } from '../tool-loader.js';

/**
 * Validation schema for todo_list input
 */
const TodoListSchema = z.object({
  completed: z.boolean().optional()
});

/**
 * Todo List tool implementation
 */
export class TodoListTool {
  constructor(private db: Database) {}

  /**
   * Execute the todo_list tool
   */
  async execute(context: ToolContext): Promise<TodoListResult> {
    try {
      // Validate input
      const validationResult = TodoListSchema.safeParse(context.input);
      
      if (!validationResult.success) {
        const errors = validationResult.error.errors
          .map(err => err.message)
          .join(', ');
        return {
          success: false,
          message: `Invalid completed filter: ${errors}`
        };
      }

      const { completed } = validationResult.data;

      // Build query based on filter
      let query = 'SELECT * FROM todos';
      const params: any[] = [];

      if (completed !== undefined) {
        query += ' WHERE completed = ?';
        params.push(completed ? 1 : 0);
      }

      query += ' ORDER BY created_at DESC';

      // Execute query
      const rows = await this.db.all<any>(query, params);

      // Transform rows to Todo objects (convert SQLite boolean)
      const todos: Todo[] = rows.map(row => ({
        id: row.id,
        title: row.title,
        description: row.description,
        completed: Boolean(row.completed),
        created_at: row.created_at
      }));

      // Generate appropriate message
      let message: string;
      if (todos.length === 0) {
        message = 'No todos found';
      } else if (completed === true) {
        message = `Found ${todos.length} completed todo${todos.length === 1 ? '' : 's'}`;
      } else if (completed === false) {
        message = `Found ${todos.length} active todo${todos.length === 1 ? '' : 's'}`;
      } else {
        message = `Found ${todos.length} todo${todos.length === 1 ? '' : 's'}`;
      }

      return {
        success: true,
        todos,
        count: todos.length,
        message
      };

    } catch (error) {
      console.error('List todos error:', error);
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
      name: 'todo_list',
      description: loadToolDescription('todo_list'),
      inputSchema: {
        type: 'object',
        properties: {
          completed: {
            type: 'boolean',
            description: 'Filter by completion status: true for completed, false for active, omit for all'
          }
        }
      }
    };
  }
}
