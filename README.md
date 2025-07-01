# MCP SIGMET Server

An MCP (Model Context Protocol) server for gathering SIGMET (Significant Meteorological Information) data from the AviationWeather.gov API.

## Features

- Fetches domestic SIGMETs from the United States
- Fetches international SIGMETs
- Supports filtering by hazard type (convective, turbulence, icing, IFR)
- Supports filtering by flight level
- Returns data in JSON format
- Built with TypeScript for type safety

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

```bash
# Test the API client directly
npm run test:api

# Test MCP server components (validation, schemas, etc.)
npm run test:mcp

# Test full MCP server integration (requires build first)
npm run build
npm run test:integration

# Manual interactive testing
npm run build
node tests/manual-test.js

# Run unit tests (when implemented)
npm test
```

### Test Results Summary

✅ **API Client Test**: Successfully connects to AviationWeather.gov API and retrieves SIGMET data
✅ **MCP Component Test**: Validates parameters, tests API calls, and verifies response formats
✅ **MCP Integration Test**: Full end-to-end testing with real MCP client-server communication
✅ **Manual Test**: Interactive testing with custom parameters

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

This MCP server provides tools for retrieving SIGMET data:

### Domestic SIGMETs
- **Tool**: `get_domestic_sigmets`
- **Description**: Retrieves domestic SIGMETs for the United States
- **Parameters**:
  - `hazard` (optional): Filter by hazard type (`conv`, `turb`, `ice`, `ifr`)
  - `level` (optional): Flight level ±3000' to search
  - `date` (optional): Specific date/time to search

### International SIGMETs
- **Tool**: `get_international_sigmets`
- **Description**: Retrieves international SIGMETs
- **Parameters**:
  - `hazard` (optional): Filter by hazard type (`turb`, `ice`)
  - `level` (optional): Flight level ±3000' to search
  - `date` (optional): Specific date/time to search

## API Reference

This server uses the [AviationWeather.gov API](https://aviationweather.gov/data/api/swagger.yaml) for data retrieval.

## License

MIT 