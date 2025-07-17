# Claude Desktop Configuration for TODO Manager MCP

## Quick Setup

1. **Build the project first:**
```bash
cd /path/to/your/mcp-howto-tutorials/todo-list-v1
npm install
npm run build
```

2. **Find your Claude Desktop config file:**
   - Location: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - If file doesn't exist, create it

3. **Add this configuration to the file:**

```json
{
  "mcpServers": {
    "todo-manager": {
      "command": "node",
      "args": ["/ABSOLUTE/PATH/TO/YOUR/mcp-howto-tutorials/todo-list-v1/dist/index.js"],
      "env": {
        "TODO_DB_PATH": "~/todos/my-todos.db"
      }
    }
  }
}
```

**⚠️ Important:** Replace `/ABSOLUTE/PATH/TO/YOUR/mcp-howto-tutorials` with your actual project path.

## If you already have other MCP servers

If your `claude_desktop_config.json` already has other servers, just add the `todo-manager` entry inside the existing `mcpServers` object:

```json
{
  "mcpServers": {
    "existing-server": {
      // ... your existing server config
    },
    "todo-manager": {
      "command": "node",
      "args": ["/ABSOLUTE/PATH/TO/YOUR/mcp-howto-tutorials/todo-list-v1/dist/index.js"],
      "env": {
        "TODO_DB_PATH": "~/todos/my-todos.db"
      }
    }
  }
}
```

## After Configuration

1. **Restart Claude Desktop** completely (quit and reopen)
2. **Test the server** by asking Claude: "Create a todo: Buy groceries"
3. **Check if it works** by asking: "Show me my todos"

## Troubleshooting

- **Server not found**: Check that the path to `dist/index.js` is correct
- **Permission errors**: Make sure the directory `~/.local/share/mcp-todo-manager/` can be created
- **Node.js issues**: Ensure Node.js 18+ is installed and `node` command works in terminal

## Database Location

**⚠️ REQUIRED:** You must specify where to store your todos in the `TODO_DB_PATH` configuration.

Example: Your todos will be stored wherever you specify in the `TODO_DB_PATH` setting.

**Supported path formats:**
- Tilde expansion: `~/todos/my-todos.db` (automatically expands to home directory)  
- Absolute paths: `/full/path/to/todos.db`
- Relative paths: `./todos.db` (relative to the server's working directory)

**No default location** - you choose where to store your data.
