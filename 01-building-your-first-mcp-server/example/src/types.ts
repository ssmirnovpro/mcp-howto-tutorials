/**
 * Todo item interface
 */
export interface Todo {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
}

/**
 * Input for creating a new task
 */
export interface CreateTaskInput {
  title: string;
  description?: string;
}

/**
 * Input for removing a task
 */
export interface RemoveTaskInput {
  id: number;
}

/**
 * Input for listing todos
 */
export interface TodoListInput {
  completed?: boolean;
}

/**
 * Result of creating a task
 */
export interface CreateTaskResult {
  success: boolean;
  taskId?: number;
  message: string;
}

/**
 * Result of removing a task
 */
export interface RemoveTaskResult {
  success: boolean;
  message: string;
}

/**
 * Result of listing todos
 */
export interface TodoListResult {
  success: boolean;
  todos?: Todo[];
  count?: number;
  message: string;
}

/**
 * MCP Tool execution context
 */
export interface ToolContext {
  input: any;
}
