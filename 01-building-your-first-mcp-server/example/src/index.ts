#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { Database, createConnection } from './database/connection.js';
import { initializeSchema } from './database/schema.js';
import { getDatabasePath } from './config/database.js';
import { CreateTaskTool } from './tools/createTask.js';
import { RemoveTaskTool } from './tools/removeTask.js';
import { TodoListTool } from './tools/todoList.js';

/**
 * MCP Todo Manager Server
 */
class TodoManagerServer {
  private server: Server;
  private db!: Database;
  private createTaskTool!: CreateTaskTool;
  private removeTaskTool!: RemoveTaskTool;
  private todoListTool!: TodoListTool;

  constructor() {
    this.server = new Server(
      {
        name: 'todo-manager',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
  }

  /**
   * Initialize database connection and tools
   */
  private async initializeDatabase(): Promise<void> {
    const dbPath = getDatabasePath();
    console.error(`Connecting to database: ${dbPath}`);
    
    this.db = await createConnection(dbPath);
    await initializeSchema(this.db);
    
    // Initialize tools with database connection
    this.createTaskTool = new CreateTaskTool(this.db);
    this.removeTaskTool = new RemoveTaskTool(this.db);
    this.todoListTool = new TodoListTool(this.db);
    
    console.error('Database initialized successfully');
  }

  /**
   * Setup MCP server handlers
   */
  private setupHandlers(): void {
    // Handle tool listing
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          CreateTaskTool.getDefinition(),
          RemoveTaskTool.getDefinition(),
          TodoListTool.getDefinition(),
        ],
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'create_task': {
            const result = await this.createTaskTool.execute({ input: args });
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(result, null, 2),
                },
              ],
            };
          }

          case 'remove_task': {
            const result = await this.removeTaskTool.execute({ input: args });
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(result, null, 2),
                },
              ],
            };
          }

          case 'todo_list': {
            const result = await this.todoListTool.execute({ input: args });
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(result, null, 2),
                },
              ],
            };
          }

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        console.error(`Tool execution error for ${name}:`, error);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: false,
                message: `Tool execution failed: ${(error as Error).message}`,
              }, null, 2),
            },
          ],
          isError: true,
        };
      }
    });
  }

  /**
   * Start the server
   */
  async start(): Promise<void> {
    try {
      await this.initializeDatabase();

      const transport = new StdioServerTransport();
      await this.server.connect(transport);
      
      console.error('Todo Manager MCP Server started successfully');
      
      // Keep the process alive
      process.on('SIGINT', async () => {
        console.error('Shutting down server...');
        await this.cleanup();
        process.exit(0);
      });

    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  }

  /**
   * Cleanup resources
   */
  private async cleanup(): Promise<void> {
    if (this.db) {
      await this.db.close();
      console.error('Database connection closed');
    }
  }
}

/**
 * Main entry point
 */
async function main(): Promise<void> {
  const server = new TodoManagerServer();
  await server.start();
}

// Start the server if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export { TodoManagerServer };
