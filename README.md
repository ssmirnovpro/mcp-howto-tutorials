# MCP How-To Tutorials

A comprehensive collection of tutorials for building Model Context Protocol (MCP) servers. Learn to create AI integrations that let Claude work directly with your applications, databases, and APIs.

## What You'll Learn

- **MCP Protocol Fundamentals** - Understanding JSON-RPC 2.0 communication with AI assistants
- **Tool Development** - Creating and registering MCP tools that Claude can use autonomously  
- **Data Integration** - Connecting Claude to databases, APIs, and file systems
- **Production Practices** - Testing, error handling, deployment, and security considerations

## Prerequisites

- Node.js 18 or higher
- Claude Desktop application
- Basic knowledge of TypeScript/JavaScript

## Quick Start

1. **Clone the repository:**
```bash
git clone https://github.com/ssmirnovpro/mcp-howto-tutorials.git
cd mcp-howto-tutorials
```

2. **Start with the first tutorial:**
```bash
cd 01-building-your-first-mcp-server/example
npm install
npm run build
```

3. **Configure Claude Desktop:**
Add the server to your Claude Desktop configuration (see tutorial README for details)

4. **Test the implementation:**
```bash
npm test
```

## Tutorials

### 📚 01 - Building Your First MCP Server
**Location:** `01-building-your-first-mcp-server/`

Learn MCP fundamentals by building a TODO manager that Claude can use to create, list, and remove tasks.

**What you'll build:**
- Complete MCP server with SQLite database
- Three MCP tools: create_task, remove_task, todo_list
- Input validation with Zod schemas
- Comprehensive error handling
- Full test suite

**Read the tutorial:** [article.md](./01-building-your-first-mcp-server/article.md)
**Run the code:** [example/](./01-building-your-first-mcp-server/example/)

### 🚀 More Tutorials Coming Soon
- **02** - Advanced MCP Features: Editing, tagging, and complex workflows
- **03** - MCP Server Distribution: Packaging and deployment strategies  
- **04** - External Integrations: Connecting to popular TODO services

## Project Structure

```
mcp-howto-tutorials/
├── 01-building-your-first-mcp-server/
│   ├── article.md                   # Tutorial article
│   └── example/                     # Working code example
│       ├── src/                     # TypeScript source
│       ├── tests/                   # Test suite
│       ├── package.json
│       └── README.md                # Setup instructions
├── 02-advanced-features/            # Coming soon
├── 03-deployment/                   # Coming soon
└── README.md                        # This file
```

## Key Technologies

- **Model Context Protocol (MCP)** - Anthropic's protocol for AI-tool communication
- **TypeScript** - Type-safe development with modern JavaScript features
- **SQLite** - Lightweight database for data persistence
- **Zod** - Runtime type validation and schema definition
- **Jest** - Testing framework for unit and integration tests

## Features Demonstrated

- ✅ **MCP Protocol Implementation** - Proper JSON-RPC 2.0 communication
- ✅ **Tool Development** - Creating and registering MCP tools
- ✅ **Data Persistence** - SQLite integration with proper schema
- ✅ **Input Validation** - Zod schemas for type-safe validation
- ✅ **Error Handling** - Comprehensive error management for AI interaction
- ✅ **Testing** - Unit and integration tests with Jest
- ✅ **TypeScript** - Full type safety and modern JavaScript
- ✅ **Production Practices** - Logging, configuration, deployment readiness

## Development Workflow

Each tutorial follows the same structure:

1. **Read the article** - Understanding concepts and architecture
2. **Examine the code** - Well-commented implementation examples
3. **Run the tests** - Verify functionality and learn testing patterns
4. **Integrate with Claude** - Real-world usage with Claude Desktop
5. **Experiment** - Try different prompts and see how Claude uses your tools

## Best Practices Covered

### Code Quality
- **TypeScript strict mode** - Maximum type safety
- **ESLint configuration** - Consistent code style  
- **Comprehensive testing** - Unit and integration tests
- **Error boundaries** - Graceful error handling
- **Input validation** - Runtime type checking

### Production Readiness
- **Configuration management** - Environment-based configuration
- **Database best practices** - Proper schema, migrations, indexing
- **Logging and monitoring** - Structured logging with levels
- **Resource management** - Proper cleanup and connection handling
- **Security considerations** - Input sanitization, safe defaults

### MCP-Specific
- **Protocol compliance** - Follows MCP specification exactly
- **Tool design patterns** - Reusable tool architecture
- **AI-friendly errors** - Error messages that help Claude understand problems
- **Claude Desktop integration** - Proper configuration and troubleshooting

## Contributing

We welcome contributions! Please:

1. **Start with existing tutorials** - Understand the patterns first
2. **Follow TypeScript standards** - Maintain type safety
3. **Add comprehensive tests** - All new features need tests  
4. **Update documentation** - Keep articles and READMEs current
5. **Test with Claude Desktop** - Ensure real-world functionality

## Support

- **Issues:** Report bugs and request features via GitHub issues
- **Discussions:** Join conversations about MCP development
- **Documentation:** Each tutorial includes comprehensive setup guides

## License

MIT License - see [LICENSE](./LICENSE) file for details.

## Acknowledgments

- **Anthropic** - For creating the Model Context Protocol
- **Claude Desktop** - For providing the runtime environment  
- **MCP Community** - For feedback and contributions

---

**Ready to start building?** Head to [01-building-your-first-mcp-server/](./01-building-your-first-mcp-server/) and begin your MCP journey!
