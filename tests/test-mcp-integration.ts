import { spawn } from 'child_process';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

async function testMcpIntegration() {
  console.log('🧪 Testing MCP Server Integration...');
  
  const client = new Client({
    name: 'test-client',
    version: '1.0.0',
  });
  
  // Create transport with the correct server parameters
  const transport = new StdioClientTransport({
    command: 'node',
    args: ['dist/index.js']
  });
  
  try {
    // Connect to the server
    console.log('🔗 Connecting to MCP server...');
    await client.connect(transport);
    console.log('✅ Connected to MCP server');
    
    // Test 1: List available tools
    console.log('\n🔍 Testing tool listing...');
    const tools = await client.listTools();
    console.log('✅ Available tools:', tools.tools.map((t: any) => t.name));
    
    // Test 2: Test domestic SIGMETs tool
    console.log('\n🔍 Testing get_domestic_sigmets tool...');
    const domesticResult = await client.callTool({
      name: 'get_domestic_sigmets',
      arguments: {
        hazard: 'turb',
        level: 300
      }
    });
    console.log('✅ Domestic SIGMETs tool call successful');
    // Pretty print
    const domesticPretty = await client.callTool({
      name: 'get_domestic_sigmets',
      arguments: {
        hazard: 'turb',
        level: 300,
        humanReadable: true
      }
    });
    console.log('✅ Domestic SIGMETs (pretty) call successful');
    
    // Type-safe access to response content
    const domesticContent = domesticResult.content as Array<{ type: string; text: string }>;
    if (domesticContent && domesticContent.length > 0) {
      console.log('📄 Response length:', domesticContent[0].text.length);
      console.log('📄 Sample response:', domesticContent[0].text.substring(0, 200) + '...');
    }
    
    // Test 3: Test international SIGMETs tool
    console.log('\n🔍 Testing get_international_sigmets tool...');
    const internationalResult = await client.callTool({
      name: 'get_international_sigmets',
      arguments: {}
    });
    console.log('✅ International SIGMETs tool call successful');
    // Pretty print
    const internationalPretty = await client.callTool({
      name: 'get_international_sigmets',
      arguments: { humanReadable: true }
    });
    console.log('✅ International SIGMETs (pretty) call successful');
    
    // Type-safe access to response content
    const internationalContent = internationalResult.content as Array<{ type: string; text: string }>;
    if (internationalContent && internationalContent.length > 0) {
      console.log('📄 Response length:', internationalContent[0].text.length);
      console.log('📄 Sample response:', internationalContent[0].text.substring(0, 200) + '...');
    }
    
    // Test 4: Test error handling
    console.log('\n🔍 Testing error handling...');
    try {
      await client.callTool({
        name: 'get_domestic_sigmets',
        arguments: {
          hazard: 'invalid_hazard'
        }
      });
      console.log('❌ Expected error was not thrown');
    } catch (error) {
      console.log('✅ Error properly caught:', error instanceof Error ? error.message : 'Unknown error');
    }
    
    // Test 5: Test unknown tool
    console.log('\n🔍 Testing unknown tool...');
    try {
      await client.callTool({
        name: 'unknown_tool',
        arguments: {}
      });
      console.log('❌ Expected error was not thrown');
    } catch (error) {
      console.log('✅ Unknown tool error properly caught:', error instanceof Error ? error.message : 'Unknown error');
    }
    
    console.log('\n✅ All MCP integration tests completed successfully!');
    
  } catch (error) {
    console.error('💥 MCP integration test failed:', error);
    throw error;
  } finally {
    // Clean up
    await transport.close();
    console.log('🔌 MCP server connection closed');
  }
}

// Run the test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('🚀 Starting MCP integration test...');
  testMcpIntegration().then(() => {
    console.log('✅ MCP integration test completed');
  }).catch((error) => {
    console.error('💥 MCP integration test failed:', error);
    process.exit(1);
  });
} 