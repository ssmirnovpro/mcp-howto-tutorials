# Building Your First MCP Server: A Developer's Guide

## Introduction

Model Context Protocol (MCP) from Anthropic is revolutionizing how AI interacts with external systems. Instead of asking users to copy data into chat, Claude can now work directly with your files, databases, and APIs.

The key insight behind MCP: **your server's client is the AI Assistant itself**. You create tools, describe their purpose, and Claude autonomously decides when and how to use them based on conversation context.

To understand the core principles of building MCP servers, we'll dissect a simple TODO manager. This is a minimal yet fully functional implementation that demonstrates all key components without unnecessary complexity. In our examples, we'll use Claude Desktop as the client for ease of integration.

At first glance, tasks like "buy milk" or "call mom" seem trivial. But when an AI assistant starts working with your TODO server, something magical happens. It doesn't just execute commands—it creatively interprets your words, guesses intentions, and finds unexpected connections between tasks. Watching this process becomes a fascinating exploration of how artificial intelligence understands human language.

🚀 **Live Code**: Clone and run the complete example: [mcp-howto-tutorials](https://github.com/ssmirnovpro/mcp-howto-tutorials). You can download it, install it on your computer, and experiment with different queries to Claude.

## Core Components of an MCP Server

Every MCP server consists of four key building blocks:

![MCP Server Architecture](https://f005.backblazeb2.com/file/content-public/ui-generator/diagram-1752650446890-3c47e7377c55.png)

### 1. JSON-RPC 2.0 Handler
Processes incoming requests from Claude Desktop. Required methods:
- `initialize` — server initialization
- `list_tools` — lists available tools
- `call_tool` — executes a specific tool

### 2. Tool Registry
Registers available tools. Each tool must contain:
- **Name** — unique identifier
- **Description** — what the tool does (this serves as an instruction for the AI)
- **Input data schema** — what parameters it accepts

### 3. Business Logic Layer
Executes the main application logic:
- Input data validation
- Database interaction
- Error handling

### 4. Configuration Layer
Manages application settings:
- File and database paths
- Environment variables
- Connection parameters

## Essential MCP Requirements

When developing an MCP server, there are specific requirements without which the server simply won't start in Claude Desktop:

**Required methods** — the server must respond to `initialize`, `tools/list` and `tools/call`. Methods `resources/list` and `prompts/list` are optional according to the MCP specification.

**Input data validation** — each tool must verify parameter correctness before execution. Claude may misinterpret instructions and send incorrect data. Returning a specific error description forces it to understand its mistake and more carefully analyze tool requirements on the next attempt.

**Tool response format** — tool execution results must be returned as an array of objects in the `content` field, not as a simple string.

**Persistent connection** — the server must run in an infinite loop, reading commands from stdin and sending responses to stdout, not terminating after the first response.

## TODO Manager Implementation

Our server provides Claude with three tools:

```typescript
// Task creation
{
  name: "create_task",
  description: await loadToolDescription("create_task"),
  inputSchema: {
    type: "object",
    properties: {
      title: { type: "string", minLength: 1, maxLength: 200 },
      description: { type: "string", maxLength: 1000 }
    },
    required: ["title"]
  }
}
```

We've moved tool descriptions to separate files to make experimentation easier—this makes it easier to test different instruction formulations without changing code. But this isn't mandatory; you can include descriptions directly in code.

### Validation with Zod Library

```typescript
const CreateTaskSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional()
});
```

Zod is a TypeScript library for data validation. It checks data types at runtime and generates clear error messages for Claude.

### Configurable Paths

```typescript
const dbPath = process.env.TODO_DB_PATH || 
  path.join(os.homedir(), '.local/share/mcp-todo-manager/todos.db');
```

The database path is read from an environment variable (set in Claude Desktop configuration), with a suitable default value in the user directory if the variable isn't set.

### Handler Architecture

```typescript
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  switch (name) {
    case "create_task":
      return await handleCreateTask(args);
    case "remove_task":
      return await handleRemoveTask(args);
    case "todo_list":
      return await handleTodoList(args);
    default:
      throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
  }
});
```

### Error Handling in MCP Format

```typescript
try {
  const validatedArgs = CreateTaskSchema.parse(args);
  const result = await db.run(
    'INSERT INTO todos (title, description) VALUES (?, ?)',
    [validatedArgs.title, validatedArgs.description || null]
  );
  
  return {
    content: [{ 
      type: "text", 
      text: `Task created successfully with ID: ${result.lastID}` 
    }]
  };
} catch (error) {
  // Proper way to handle errors in MCP
  return {
    isError: true,
    content: [{
      type: "text",
      text: error instanceof z.ZodError 
        ? `Validation error: ${error.errors.map(e => e.message).join(', ')}`
        : `Database error: ${error.message}`
    }]
  };
}
```

**Key error handling principles:**

- **Use `isError: true`** for all tool execution errors — this allows Claude to see the error and react to it
- **Don't create custom JSON-RPC error codes** — this may break compatibility with Claude Desktop
- **Make messages clear** — Claude may show them to users or use them for decision-making
- **Include context** — specify what went wrong and which data was incorrect

**Why this matters:** Claude analyzes error messages and can take corrective actions, such as asking the user to fix input or trying a different approach.

## How Claude Interacts with Your Server

![Claude MCP Interaction Flow](https://f005.backblazeb2.com/file/content-public/ui-generator/diagram-1752678729880-687de8e04a62.png)

It's important to understand: **you cannot force Claude to use your tools**. You can only provide them and describe their purpose well.

Claude decides which tool to use based on:
- Conversation context
- Tool descriptions
- Parameter names and schemas

**Examples of requests with varying degrees of "directness":**

- "Show my tasks" → likely to call `todo_list`
- "I have many things to do today" → might ignore the TODO server
- "Add to list: buy milk" → almost guaranteed to call `create_task`
- "How are things?" → unlikely to trigger the TODO tools

### Experiment!

After installing the server, try different request formulations. It's a fascinating process—watching how Claude interprets your words and decides which tools to use. You'll understand AI logic and be able to create more effective descriptions for your tools.

If Claude didn't react to your request as expected, ask it directly: "Why didn't you use the TODO tools?" It can explain why it didn't consider your request suitable for task management, helping you better understand its logic.

## Integration with Claude Desktop

![MCP Setup and Configuration](https://f005.backblazeb2.com/file/content-public/ui-generator/diagram-1752680156943-e25a00bc803f.png)

```json
{
  "mcpServers": {
    "todo-manager": {
      "command": "node",
      "args": ["/absolute/path/to/dist/index.js"],
      "env": {
        "TODO_DB_PATH": "~/todos/my-todos.db"
      }
    }
  }
}
```

After adding the configuration, restart Claude Desktop. The server will be available in all chats.

## Troubleshooting

If something goes wrong, check the server status in Claude Desktop: open **Settings → Developer**. Here you'll see all your MCP servers with their status.

If your server has an error (with a red indicator), click on it to see error details and a link to the log file. This section also has a link to Claude's official documentation on debugging MCP servers.

Most common issues:
- Incorrect path to the executable file in the configuration
- Server terminates after the first response (no infinite loop)
- Missing required methods `tools/list` or `tools/call`
- Incorrect JSON format in responses

## Testing MCP Servers

```typescript
describe('MCP TODO Server', () => {
  it('should handle task creation', async () => {
    const response = await callTool('create_task', {
      title: 'Test task'
    });
    
    expect(response.content[0].text).toContain('created successfully');
  });
});
```

Testing is especially important for MCP servers since you don't work with tools directly—they're used by the AI assistant. Without tests, you might not notice that Claude is receiving incorrect data, causing it to behave unexpectedly.

If you want to see the protocol exchange between Claude and your server, logs are usually found in `~/Library/Logs/Claude/`. If you can't find them there, ask Claude where they're located—it will suggest the current location.

## Summary: What's Essential for a Working MCP Server

1. **Informative tool descriptions** — the quality of the description determines how correctly Claude will use your tool
2. **Required methods** — implement `initialize`, `tools/list` and `tools/call`. Methods `resources/list` and `prompts/list` are optional
3. **Proper response format** — tool results must be in the `content` array, not a simple string
4. **Persistent connection** — server must run in a loop, not terminate after first response
5. **Input data validation** — check parameters and return clear errors to Claude

## What's Next

The basic TODO MCP server is just the beginning. In upcoming articles, we'll develop the same project further:

**Editing and Tags** — we'll add the ability to modify existing tasks and implement a tagging system. Claude will learn to automatically assign tags to new tasks and use them for filtering.

**MCP Server Distribution** — we'll package the server into an installation-ready package with automatic registration in Claude Desktop.

**Integration with External TODO Services** — we'll connect popular task management services for data synchronization.

## What's Beyond This Article's Scope

For simplicity and focus on fundamentals, we deliberately excluded several aspects important for production-ready MCP servers:

### Deployment and Transport
- Remote MCP servers — HTTP transport, Server-Sent Events for remote servers
- Desktop Extensions (DXT) — new distribution method via drag-and-drop files  
- Cloud deployment — deploying to the cloud (Cloudflare Workers, AWS Lambda, etc.)

### Production Readiness
- Security best practices — protection against prompt injection, tool access control
- Advanced testing — MCP Inspector, automated testing, CI/CD
- Performance & monitoring — performance optimization, logging, metrics

### Extended Functionality
- Resources and Prompts — working with files, request templates for Claude
- Advanced tool patterns — complex tools, workflow orchestration  
- Integration with other AI clients — using MCP servers outside Claude Desktop

These topics require separate consideration and could become subjects of future articles in the series.

## Conclusion

MCP opens incredible possibilities for creating smart integrations. The key to success is understanding that you're creating tools for AI, not for humans. Claude decides when and how to use them based on context and the quality of your descriptions.

Experiment, ask Claude different questions, and observe how it works with your tools. This is the best way to understand AI logic and create truly useful MCP servers.

Ready to get started? Clone the repository and begin building your first MCP integration today.

---

**Source code:** [github.com/ssmirnovpro/mcp-howto-tutorials](https://github.com/ssmirnovpro/mcp-howto-tutorials)
