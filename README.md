# MCP SIGMET Server

An MCP (Model Context Protocol) server for gathering SIGMET (Significant Meteorological Information) data from the AviationWeather.gov API.

## Features

- Fetches domestic SIGMETs from the United States
- Fetches international SIGMETs
- Supports filtering by hazard type (convective, turbulence, icing, IFR)
- Supports filtering by flight level
- Returns data in JSON format with optional human-readable formatting
- Built with TypeScript for type safety
- Comprehensive parameter validation using Zod schemas
- Full test coverage with Vitest

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Testing

The project uses [Vitest](https://vitest.dev/) for comprehensive testing with multiple test suites:

```bash
# Run all tests
npm test

# Run tests with UI (interactive)
npm run test:ui

# Run specific test suites
npm run test:api      # API client tests
npm run test:mcp      # MCP server component tests
npm run test:integration  # Full MCP integration tests

# Manual interactive testing
npm run build
node tests/manual-test.js
```

### Test Coverage

✅ **API Client Tests** (`tests/api-client.test.ts`): Tests the AviationWeather.gov API client
- Domestic SIGMET retrieval with and without filters
- International SIGMET retrieval
- Parameter validation and error handling
- Human-readable output formatting

✅ **MCP Server Tests** (`tests/test-mcp-server.ts`): Tests MCP server components
- Tool registration and parameter validation
- API integration and response formatting
- Error handling for invalid parameters

✅ **Integration Tests** (`tests/mcp-integrations.test.ts`): End-to-end MCP client-server testing
- Full MCP protocol communication
- Tool listing and execution
- Real API calls with various parameters
- Error handling for unknown tools

✅ **Manual Tests** (`tests/manual-test.js`): Interactive testing with custom parameters

## Debugging

### VS Code Debugging
1. Open the project in VS Code
2. Go to the Debug panel (Ctrl+Shift+D / Cmd+Shift+D)
3. Choose one of the following configurations:
   - **"Debug Test API (Compiled)"** - Uses compiled JavaScript (recommended)
   - **"Debug Test API (TSX)"** - Uses tsx runtime
   - **"Debug MCP Server"** - For debugging the main server
4. Set breakpoints in your TypeScript files
5. Press F5 to start debugging

### Command Line Debugging
```bash
# Build and debug with compiled JavaScript
npm run build
node --inspect-brk dist/tests/test-api.js

# Debug with tsx (if the above doesn't work)
npx tsx --inspect-brk tests/test-api.ts

# Use the debug wrapper script
npm run debug:test
```

### Adding Breakpoints
You can add `debugger;` statements in your code:
```typescript
async function testApi() {
  debugger; // This will pause execution when debugging
  const client = new AviationWeatherApiClient();
  // ... rest of the code
}
```

### Troubleshooting
If you encounter the "Package subpath './register' is not defined" error:
1. Use the "Debug Test API (Compiled)" configuration
2. Or run `npm run build` first, then debug the compiled JavaScript
3. Make sure you're using the latest version of tsx

## Usage

This MCP server provides tools for retrieving SIGMET data with comprehensive parameter validation:

### Domestic SIGMETs
- **Tool**: `get_domestic_sigmets`
- **Description**: Retrieves domestic SIGMETs for the United States
- **Parameters**:
  - `hazard` (optional): Filter by hazard type (`conv`, `turb`, `ice`, `ifr`)
  - `level` (optional): Flight level ±3000' to search (0-600)
  - `date` (optional): Specific date/time to search (format: `yyyymmdd_hhmmZ` or `yyyy-mm-ddThh:mm:ssZ`)
  - `humanReadable` (optional): Return human-readable formatted output

### International SIGMETs
- **Tool**: `get_international_sigmets`
- **Description**: Retrieves international SIGMETs
- **Parameters**:
  - `hazard` (optional): Filter by hazard type (`turb`, `ice`)
  - `level` (optional): Flight level ±3000' to search (0-600)
  - `date` (optional): Specific date/time to search (format: `yyyymmdd_hhmmZ` or `yyyy-mm-ddThh:mm:ssZ`)
  - `humanReadable` (optional): Return human-readable formatted output

### Parameter Validation
All parameters are validated using Zod schemas:
- **Hazard types**: Strictly enforced enum values
- **Flight levels**: Must be between 0-600
- **Date formats**: Must match specified patterns
- **Error handling**: Invalid parameters throw descriptive errors

### Output Formats
- **Standard**: Raw JSON data from the API
- **Human-readable**: Formatted output with readable timestamps and descriptions (when `humanReadable: true`)

## API Reference

This server uses the [AviationWeather.gov API](https://aviationweather.gov/data/api/swagger.yaml) for data retrieval.

## License

MIT 