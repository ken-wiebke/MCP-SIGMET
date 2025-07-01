import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { AviationWeatherApiClient } from './api-client.js';
import { 
  GetDomesticSigmetsParamsSchema, 
  GetInternationalSigmetsParamsSchema 
} from './types.js';
import { makeSigmetHumanReadable } from './utils';

class SigmetServer {
  private server: Server;
  private apiClient: AviationWeatherApiClient;

  constructor() {
    this.server = new Server({
      name: 'sigmet-server',
      version: '1.0.0',
    });

    this.apiClient = new AviationWeatherApiClient();

    this.setupToolHandlers();
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'get_domestic_sigmets',
            description: 'Retrieve domestic SIGMETs (Significant Meteorological Information) for the United States. These are weather advisories for potentially hazardous conditions affecting aircraft operations.',
            inputSchema: {
              type: 'object',
              properties: {
                hazard: {
                  type: 'string',
                  enum: ['conv', 'turb', 'ice', 'ifr'],
                  description: 'Filter by hazard type: conv (convective), turb (turbulence), ice (icing), ifr (instrument flight rules)'
                },
                level: {
                  type: 'number',
                  minimum: 0,
                  maximum: 600,
                  description: 'Flight level ±3000 feet to search (e.g., 300 for FL300)'
                },
                date: {
                  type: 'string',
                  pattern: '^\\d{8}_\\d{6}Z$|^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z$',
                  description: 'Specific date/time to search (format: yyyymmdd_hhmmZ or yyyy-mm-ddThh:mm:ssZ)'
                }
              }
            }
          } as Tool,
          {
            name: 'get_international_sigmets',
            description: 'Retrieve international SIGMETs (Significant Meteorological Information). These are weather advisories for potentially hazardous conditions affecting aircraft operations outside the United States.',
            inputSchema: {
              type: 'object',
              properties: {
                hazard: {
                  type: 'string',
                  enum: ['turb', 'ice'],
                  description: 'Filter by hazard type: turb (turbulence), ice (icing)'
                },
                level: {
                  type: 'number',
                  minimum: 0,
                  maximum: 600,
                  description: 'Flight level ±3000 feet to search (e.g., 300 for FL300)'
                },
                date: {
                  type: 'string',
                  pattern: '^\\d{8}_\\d{6}Z$|^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z$',
                  description: 'Specific date/time to search (format: yyyymmdd_hhmmZ or yyyy-mm-ddThh:mm:ssZ)'
                }
              }
            }
          } as Tool
        ]
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'get_domestic_sigmets': {
            const params = GetDomesticSigmetsParamsSchema.parse(args);
            const { humanReadable, ...apiParams } = params;
            const result = await this.apiClient.getDomesticSigmets(apiParams);
            const output = humanReadable
              ? result.map(makeSigmetHumanReadable)
              : result;
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(output, null, 2)
                }
              ]
            };
          }

          case 'get_international_sigmets': {
            const params = GetInternationalSigmetsParamsSchema.parse(args);
            const { humanReadable, ...apiParams } = params;
            const result = await this.apiClient.getInternationalSigmets(apiParams);
            const output = humanReadable
              ? result.map(makeSigmetHumanReadable)
              : result;
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(output, null, 2)
                }
              ]
            };
          }

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        console.error(`Error calling tool ${name}:`, error);
        throw error;
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('MCP SIGMET server started');
  }
}

// Start the server
const server = new SigmetServer();
server.run().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
}); 