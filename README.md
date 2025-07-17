Script, Node.js 18+, SQLite, @modelcontextprotocol/sdk-typescript, Zod, Jest

## Getting Started

### Prerequisites

- Node.js 18 or higher
- Claude Desktop application
- Basic knowledge of TypeScript/JavaScript

### Quick Start

1. **Clone the repository:**
```bash
git clone [repository-url]
cd mcp-howto-tutorials
```

2. **Start with v1:**
```bash
cd todo-list-v1
npm install
npm run build
```

3. **Configure Claude Desktop:**
Add the server to your Claude Desktop configuration (see individual tutorial READMEs for details)

4. **Test the implementation:**
```bash
npm test
```

## Project Structure

```
mcp-howto-tutorials/
├── docsru/                          # Russian documentation
│   ├── mcp-howto-project-structure.md
│   ├── mcp-todo-list-tdd-spec.md
│   ├── mcp-tutorial-series-plan.md
│   └── HOWTO-mcp-server-guide.md
├── todo-list-v1/                   # Basic MCP Server Implementation
│   ├── src/
│   ├── tests/
│   ├── package.json
│   └── README.md
└── README.md                       # This file
```

## Learning Path

### Basic MCP Server Implementation
- [todo-list-v1/](./todo-list-v1/) - Complete MCP server with SQLite
- **Concepts:** Server setup, tools, database integration, testing

## Key Features Demonstrated

- ✅ **MCP Protocol Implementation** - Proper JSON-RPC 2.0 communication
- ✅ **Tool Development** - Creating and registering MCP tools
- ✅ **Data Persistence** - SQLite integration with proper schema
- ✅ **Input Validation** - Zod schemas for type-safe validation
- ✅ **Error Handling** - Comprehensive error management
- ✅ **Testing** - Unit and integration tests with Jest
- ✅ **TypeScript** - Full type safety and modern JavaScript
- ✅ **Production Practices** - Logging, configuration, deployment

## Documentation

### Core Documentation (Russian)
- **[Project Structure](./docsru/mcp-howto-project-structure.md)** - Overall project organization
- **[TDD Specification](./docsru/mcp-todo-list-tdd-spec.md)** - Detailed implementation spec
- **[MCP Server Guide](./docsru/HOWTO-mcp-server-guide.md)** - Production checklist and best practices

### Tutorial README
The todo-list-v1 has comprehensive README with:
- Setup instructions
- Code walkthrough
- Usage examples
- Troubleshooting guide

## Best Practices Demonstrated

### Code Quality
- **TypeScript strict mode** - Maximum type safety
- **ESLint configuration** - Consistent code style
- **Comprehensive testing** - Unit and integration tests
- **Error boundaries** - Graceful error handling
- **Input validation** - Runtime type checking with Zod

### Production Readiness
- **Configuration management** - Environment-based config
- **Database best practices** - Proper schema, migrations, indexing
- **Logging and monitoring** - Structured logging with levels
- **Resource management** - Proper cleanup and connection handling
- **Security considerations** - Input sanitization, safe defaults

### MCP-Specific
- **Protocol compliance** - Follows MCP 2024-11-05 specification
- **Tool design patterns** - Reusable tool architecture
- **Resource management** - Efficient data handling
- **Claude Desktop integration** - Proper configuration examples

## Contributing

We welcome contributions! Please:

1. **Start with existing tutorials** - Understand the patterns first
2. **Follow TypeScript standards** - Maintain type safety
3. **Add comprehensive tests** - All new features need tests
4. **Update documentation** - Keep READMEs current
5. **Test with Claude Desktop** - Ensure real-world functionality

### Development Setup
```bash
# Install dependencies
cd todo-list-v1
npm install

# Run tests
npm test

# Run linting
npm run lint

# Build the project
npm run build
```

## Support and Community

- **Issues:** Report bugs and request features via GitHub issues
- **Discussions:** Join conversations about MCP development
- **Documentation:** Comprehensive guides in both English and Russian

## License

MIT License - see [LICENSE](./LICENSE) file for details.

## Acknowledgments

- **Anthropic** - For creating the Model Context Protocol
- **Claude Desktop** - For providing the runtime environment
- **MCP Community** - For feedback and contributions

---

**Ready to start building?** Head to [todo-list-v1/](./todo-list-v1/) and begin your MCP journey!
