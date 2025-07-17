import { z } from 'zod';
import { Database } from '../database/connection.js';
import { CreateTaskResult, ToolContext } from '../types.js';
import { loadToolDescription } from '../tool-loader.js';

/**
 * Validation schema for create_task input
 */
const CreateTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title too long (max 200 characters)')
    .transform(val => val.trim())
    .refine(val => val.length > 0, 'Title cannot be empty'),
  description: z
    .string()
    .max(1000, 'Description too long (max 1000 characters)')
    .optional()
    .transform(val => {
      if (!val || val.trim().length === 0) return undefined;
      return val.trim();
    })
});

/**
 * Create Task tool implementation
 */
export class CreateTaskTool {
  constructor(private db: Database) {}

  /**
   * Execute the create_task tool
   */
  async execute(context: ToolContext): Promise<CreateTaskResult> {
    try {
      // Validate input
      const validationResult = CreateTaskSchema.safeParse(context.input);
      
      if (!validationResult.success) {
        const errors = validationResult.error.errors
          .map(err => err.message)
          .join(', ');
        return {
          success: false,
          message: `Validation error: ${errors}`
        };
      }

      const { title, description } = validationResult.data;

      // Insert into database
      const result = await this.db.run(
        'INSERT INTO todos (title, description) VALUES (?, ?)',
        [title, description || null]
      );

      return {
        success: true,
        taskId: result.lastID,
        message: `Task created successfully with ID ${result.lastID}`
      };

    } catch (error) {
      console.error('Create task error:', error);
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
      name: 'create_task',
      description: loadToolDescription('create_task'),
      inputSchema: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            description: 'The title of the task (1-200 characters)',
            minLength: 1,
            maxLength: 200
          },
          description: {
            type: 'string',
            description: 'Optional description of the task (max 1000 characters)',
            maxLength: 1000
          }
        },
        required: ['title']
      }
    };
  }
}
