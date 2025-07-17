import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Load tool description from markdown file
 * @param toolName - Name of the tool (matches filename without .md)
 * @returns Tool description extracted from markdown file
 */
export function loadToolDescription(toolName: string): string {
  try {
    // Use relative path from the compiled dist directory
    const filePath = join(process.cwd(), 'src', 'tool-descriptions', `${toolName}.md`);
    const content = readFileSync(filePath, 'utf8');
    
    // Extract just the description section (first paragraph after ## Description)
    const lines = content.split('\n');
    const descriptionStart = lines.findIndex(line => line.trim() === '## Description');
    
    if (descriptionStart === -1) {
      throw new Error(`No ## Description section found in ${toolName}.md`);
    }
    
    // Find the next section or end of file
    let descriptionEnd = lines.length;
    for (let i = descriptionStart + 1; i < lines.length; i++) {
      const line = lines[i];
      if (line && line.startsWith('##')) {
        descriptionEnd = i;
        break;
      }
    }
    
    // Extract description content (skip the ## Description line)
    const descriptionLines = lines.slice(descriptionStart + 1, descriptionEnd);
    return descriptionLines
      .join('\n')
      .trim()
      .replace(/^\n+/, ''); // Remove leading newlines
      
  } catch (error) {
    console.warn(`Could not load description for tool ${toolName}:`, (error as Error).message);
    // Fallback to generic description
    return `${toolName} tool - description not available`;
  }
}

/**
 * Load full tool documentation for debugging/reference
 * @param toolName - Name of the tool
 * @returns Full markdown content
 */
export function loadFullToolDoc(toolName: string): string {
  try {
    const filePath = join(process.cwd(), 'src', 'tool-descriptions', `${toolName}.md`);
    return readFileSync(filePath, 'utf8');
  } catch (error) {
    return `Documentation for ${toolName} not found`;
  }
}
