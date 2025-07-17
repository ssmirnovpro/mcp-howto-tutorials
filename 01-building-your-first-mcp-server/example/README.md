# Todo Manager MCP Server

A Model Context Protocol (MCP) server for managing TODO lists with Claude Desktop. This is a production-ready implementation that demonstrates core MCP concepts including tools, data persistence, and proper error handling.

## Features

- **Create Tasks**: Add new tasks with title and optional description
- **List Tasks**: View all tasks or filter by completion status  
- **Remove Tasks**: Delete tasks by ID
- **Local Timestamps**: Creation dates in local time (not UTC)
- **Editable Tool Descriptions**: Experiment with different prompts for each tool
- **Data Persistence**: SQLite database with configurable location
- **Input Validation**: Comprehensive validation using Zod schemas
- **TypeScript**: Full type safety and modern JavaScript features
- **Production Ready**: Comprehensive test suite and error handling

## Quick Start

### Prerequisites

- Node.js 18 or higher
- Claude Desktop application

### Installation

1. Clone and navigate to the project:
```bash
git clone [repository-url]
cd todo-list-v1
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

### Claude Desktop Configuration

Add the following to your Claude Desktop configuration file:

**Location of config file:**
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%/Claude/claude_desktop_config.json`
- Linux: `~/.config/claude/claude_desktop_config.json`

**Configuration:**
```json
{
  "mcpServers": {
    "todo-manager": {
      "command": "node",
      "args": ["/ABSOLUTE/PATH/TO/YOUR/todo-list-v1/dist/index.js"],
      "env": {
        "TODO_DB_PATH": "~/.local/share/mcp-todo-manager/todos.db"
      }
    }
  }
}
```

**⚠️ Important:** Replace `/ABSOLUTE/PATH/TO/YOUR/todo-list-v1` with the actual path to your project directory.

### Database Configuration

**⚠️ REQUIRED:** You must specify the database path in your Claude Desktop configuration.

Set the `TODO_DB_PATH` environment variable in the Claude Desktop configuration:

```json
{
  "mcpServers": {
    "todo-manager": {
      "command": "node",
      "args": ["/ABSOLUTE/PATH/TO/YOUR/todo-list-v1/dist/index.js"],
      "env": {
        "TODO_DB_PATH": "~/todos/my-todos.db"
      }
    }
  }
}
```

**Supported path formats:**
- Tilde expansion: `~/todos/my-todos.db` (recommended)
- Absolute paths: `/full/path/to/todos.db`
- Relative paths: `./todos.db` (relative to the server's working directory)

**No default database location** - you must explicitly configure where you want your todos stored.

## Usage

Once configured, you can use the following commands in Claude Desktop:

### Create a Task
```
Create a task: "Buy groceries" with description "Milk, bread, eggs"
```

### List All Tasks
```
Show me all my tasks
```

### List Active Tasks
```
Show me my incomplete tasks
```

### List Completed Tasks
```
Show me my completed tasks
```

### Remove a Task
```
Remove task with ID 3
```

## Available Tools

### create_task
Creates a new task item.

**Parameters:**
- `title` (required): The title of the task (1-200 characters)
- `description` (optional): Detailed description (max 1000 characters)

**Example:**
```json
{
  "title": "Buy groceries",
  "description": "Need to get milk, bread, and eggs from the store"
}
```

### remove_task
Removes a task by its ID.

**Parameters:**
- `id` (required): The ID of the task to remove

**Example:**
```json
{
  "id": 3
}
```

### todo_list
Retrieves a list of tasks, optionally filtered by completion status.

**Parameters:**
- `completed` (optional): Filter by completion status
  - `true`: Show only completed tasks
  - `false`: Show only active (incomplete) tasks
  - Not specified: Show all tasks

**Example:**
```json
{
  "completed": false
}
```

## Development

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Linting
```bash
# Check for linting issues
npm run lint

# Fix linting issues automatically
npm run lint:fix
```

### Development Mode
```bash
# Build and run
npm run dev
```

## Experimenting with Tool Descriptions

This server includes editable tool descriptions that you can modify to see how they affect Claude's behavior.

### Tool Description Files

Each tool has its description in a separate markdown file:
- `src/tool-descriptions/create_task.md`
- `src/tool-descriptions/remove_task.md`  
- `src/tool-descriptions/todo_list.md`

### How to Experiment

1. **Edit a description file** - Modify the text in any `.md` file
2. **Rebuild the project** - Run `npm run build`
3. **Restart Claude Desktop** - To reload the MCP server
4. **Test different requests** - See how Claude responds to the new descriptions

### Description Examples

Try these different styles in `create_task.md`:

**Short and Simple:**
```
Create a new todo task with title and optional description.
```

**Detailed and Instructive:**
```
Create a new todo task with title and optional description. Tasks are automatically assigned creation timestamp in local time. Always ask for a title if not provided. Suggest breaking down complex tasks into smaller ones.
```

**With Examples:**
```
Create a new todo task with title and optional description. Examples: "Buy groceries", "Finish project report", "Call dentist tomorrow".
```

### Observing Claude's Behavior

After changing descriptions, test with various requests:
- Vague requests: "I need to organize my day"
- Direct requests: "Add a task to buy milk"
- Complex requests: "Help me plan my weekend activities"

See how different descriptions influence when and how Claude uses your tools!

## Project Structure

```
todo-list-v1/
├── src/
│   ├── config/          # Configuration utilities
│   ├── database/        # Database connection and schema
│   ├── tools/           # MCP tool implementations
│   ├── types.ts         # TypeScript type definitions
│   └── index.ts         # Main server entry point
├── tests/               # Test files
├── package.json         # Project dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── jest.config.js       # Test configuration
└── README.md           # This file
```

## Architecture

This MCP server follows production best practices:

- **Separation of Concerns**: Database, tools, and server logic are separated
- **Type Safety**: Full TypeScript implementation with strict type checking
- **Input Validation**: Zod schemas for runtime type validation
- **Error Handling**: Comprehensive error handling with meaningful messages
- **Testing**: Unit tests for all components with good coverage
- **Configuration**: Environment-based configuration for flexibility

## Troubleshooting

### Common Issues

1. **Database Permission Errors**: Ensure the directory for the database file exists and is writable
2. **Node.js Version**: Ensure you're using Node.js 18 or higher
3. **Path Issues**: Use absolute paths in Claude Desktop configuration
4. **Port Conflicts**: This server uses stdio transport, so no port conflicts should occur

### Debug Mode

To enable debug logging, set the `LOG_LEVEL` environment variable:
```json
{
  "mcpServers": {
    "todo-manager": {
      "command": "node",
      "args": ["/path/to/dist/index.js"],
      "env": {
        "TODO_DB_PATH": "~/.local/share/mcp-todo-manager/todos.db",
        "LOG_LEVEL": "debug"
      }
    }
  }
}
```

## License

MIT License - see LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

This project is part of the MCP Howto tutorial series. Visit the main repository for more MCP examples and tutorials.
