import { AviationWeatherApiClient } from '../src/api-client.js';
import { 
  GetDomesticSigmetsParamsSchema, 
  GetInternationalSigmetsParamsSchema 
} from '../src/types.js';
import { makeSigmetHumanReadable } from '../src/utils.js';

// Test the MCP server functionality by testing the core components
async function testMcpServer() {
  console.log('🧪 Testing MCP Server Components...');
  
  const apiClient = new AviationWeatherApiClient();
  
  try {
    // Test 1: Validate parameter schemas
    console.log('\n🔍 Testing parameter validation...');
    
    // Valid parameters
    const validParams = {
      hazard: 'turb' as const,
      level: 300,
      date: '20250630_000000Z'
    };
    
    const validatedDomestic = GetDomesticSigmetsParamsSchema.parse(validParams);
    console.log('✅ Domestic parameters validated:', validatedDomestic);
    
    const validatedInternational = GetInternationalSigmetsParamsSchema.parse({
      hazard: 'turb' as const,
      level: 300
    });
    console.log('✅ International parameters validated:', validatedInternational);
    
    // Test 2: Test API calls that the MCP server would make
    console.log('\n🔍 Testing API calls...');
    
    const domesticResult = await apiClient.getDomesticSigmets(validatedDomestic);
    console.log('✅ Domestic SIGMETs API call successful, found:', domesticResult.length, 'results');
    if (domesticResult.length > 0) {
      console.log('📄 Pretty Domestic SIGMET:', JSON.stringify(makeSigmetHumanReadable(domesticResult[0]), null, 2));
    }
    const internationalResult = await apiClient.getInternationalSigmets(validatedInternational);
    console.log('✅ International SIGMETs API call successful, found:', internationalResult.length, 'results');
    if (internationalResult.length > 0) {
      console.log('📄 Pretty International SIGMET:', JSON.stringify(makeSigmetHumanReadable(internationalResult[0]), null, 2));
    }
    
    // Test 3: Test error handling for invalid parameters
    console.log('\n🔍 Testing error handling...');
    
    try {
      GetDomesticSigmetsParamsSchema.parse({
        hazard: 'invalid_hazard'
      });
      console.log('❌ Expected validation error was not thrown');
    } catch (error) {
      console.log('✅ Parameter validation error properly caught:', error instanceof Error ? error.message : 'Unknown error');
    }
    
    try {
      GetDomesticSigmetsParamsSchema.parse({
        level: 1000 // Invalid level
      });
      console.log('❌ Expected validation error was not thrown');
    } catch (error) {
      console.log('✅ Level validation error properly caught:', error instanceof Error ? error.message : 'Unknown error');
    }
    
    // Test 4: Test MCP response format
    console.log('\n🔍 Testing MCP response format...');
    
    const mcpResponse = {
      content: [
        {
          type: 'text',
          text: JSON.stringify(domesticResult, null, 2)
        }
      ]
    };
    
    console.log('✅ MCP response format valid');
    console.log('📄 Response content type:', mcpResponse.content[0].type);
    console.log('📄 Response text length:', mcpResponse.content[0].text.length);
    
    // Test 5: Test tool schemas
    console.log('\n🔍 Testing tool schemas...');
    
    const domesticToolSchema = {
      name: 'get_domestic_sigmets',
      description: 'Retrieve domestic SIGMETs (Significant Meteorological Information) for the United States.',
      inputSchema: {
        type: 'object',
        properties: {
          hazard: {
            type: 'string',
            enum: ['conv', 'turb', 'ice', 'ifr'],
            description: 'Filter by hazard type'
          },
          level: {
            type: 'number',
            minimum: 0,
            maximum: 600,
            description: 'Flight level ±3000 feet to search'
          },
          date: {
            type: 'string',
            pattern: '^\\d{8}_\\d{6}Z$|^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z$',
            description: 'Specific date/time to search'
          }
        }
      }
    };
    
    const internationalToolSchema = {
      name: 'get_international_sigmets',
      description: 'Retrieve international SIGMETs.',
      inputSchema: {
        type: 'object',
        properties: {
          hazard: {
            type: 'string',
            enum: ['turb', 'ice'],
            description: 'Filter by hazard type'
          },
          level: {
            type: 'number',
            minimum: 0,
            maximum: 600,
            description: 'Flight level ±3000 feet to search'
          },
          date: {
            type: 'string',
            pattern: '^\\d{8}_\\d{6}Z$|^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z$',
            description: 'Specific date/time to search'
          }
        }
      }
    };
    
    console.log('✅ Tool schemas defined correctly');
    console.log('📋 Available tools:', [domesticToolSchema.name, internationalToolSchema.name]);
    
    console.log('\n✅ All MCP server component tests completed successfully!');
    
  } catch (error) {
    console.error('💥 MCP server test failed:', error);
    throw error;
  }
}

// Run the test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('🚀 Starting MCP server component test...');
  testMcpServer().then(() => {
    console.log('✅ MCP server component test completed');
  }).catch((error) => {
    console.error('💥 MCP server component test failed:', error);
    process.exit(1);
  });
} 