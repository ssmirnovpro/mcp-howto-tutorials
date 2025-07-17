# Remove Task Tool

## Description
Remove a todo task by its ID. The task will be permanently deleted from the database.

## Usage Examples
- "Delete task 5"
- "Remove the completed grocery shopping task"
- "Cancel task number 12"

## Parameters
- **id** (required): The numeric ID of the task to remove (must be positive integer)

## Tips for Claude
- Always confirm the task ID before deletion
- If user mentions task by title, first list tasks to find the correct ID
- Provide feedback about successful deletion with task details
- Handle non-existent IDs gracefully
