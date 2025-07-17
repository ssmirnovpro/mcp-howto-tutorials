# Tool Descriptions

This directory contains markdown files with detailed descriptions for each MCP tool. These descriptions are automatically loaded and used when registering tools with the MCP server.

## Why External Tool Descriptions?

1. **Easy Experimentation** - You can modify descriptions without touching TypeScript code
2. **Better Documentation** - Each tool has comprehensive usage examples and tips
3. **A/B Testing** - Try different prompt styles to see how Claude responds
4. **Maintainability** - Keep tool logic separate from descriptions

## File Structure

Each tool has its own `.md` file:
- `create_task.md` - Description for the create_task tool
- `remove_task.md` - Description for the remove_task tool  
- `todo_list.md` - Description for the todo_list tool

## Format

Each markdown file should have this structure:

```markdown
# Tool Name

## Description
Brief description that gets loaded into the MCP tool definition.
This is what Claude sees when deciding which tools to use.

## Usage Examples
Examples of how users might request this functionality.

## Parameters
Description of input parameters.

## Tips for Claude
Guidance for how Claude should use this tool.
```

## Experimenting with Descriptions

Try modifying the descriptions to see how it affects Claude's behavior:

**Short and Simple:**
```
Create a new todo task with title and optional description.
```

**Detailed and Instructive:**
```
Create a new todo task with title and optional description. Tasks are automatically assigned creation timestamp in local time. Always ask for a title if not provided. Suggest breaking down complex tasks into smaller ones.
```

**With Personality:**
```
Create a new todo task! I'll help you organize your life by adding tasks with titles and optional descriptions. Don't worry about the timestamp - I'll handle that automatically.
```

## Best Practices

1. **Be Specific** - Clear descriptions help Claude understand tool purpose
2. **Include Examples** - Show typical user requests
3. **Provide Context** - Explain what the tool does and when to use it
4. **Guide Behavior** - Give Claude hints about best practices
5. **Keep It Focused** - Don't overload with too much information

## Testing Changes

After modifying descriptions:
1. Rebuild the project: `npm run build`
2. Restart Claude Desktop to reload the MCP server
3. Test with different types of requests to see how Claude responds
