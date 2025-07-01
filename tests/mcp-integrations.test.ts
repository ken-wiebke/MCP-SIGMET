import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { describe, it, test, expect, beforeAll, afterAll } from 'vitest';

describe('MCP SIGMET Tools', () => {
  let client: Client;
  let transport: StdioClientTransport;

  beforeAll(async () => {
    client = new Client({
      name: 'sigmet-test-client',
      version: '1.0.0',
    });
    transport = new StdioClientTransport({
      command: 'node',
      args: ['dist/src/index.js'],
    });
    await client.connect(transport);
  });

  afterAll(async () => {
    await transport.close();
  });
  

  test('listTools returns available tools', async () => {
    const tools = await client.listTools();
    expect(Array.isArray(tools.tools)).toBe(true);
    expect(tools.tools.some((t: any) => t.name === 'get_domestic_sigmets')).toBe(true);
    expect(tools.tools.some((t: any) => t.name === 'get_international_sigmets')).toBe(true);
  });

  /*
    get_domestic_sigmets returns an array of objects with the following properties:
    This is a poor test as it isn't deterministic and it only checks for the very basic structure.  But this is a sample project and not a real solution.
  */
  describe('get_domestic_sigmets', () => {
    it('returns results for no parameters', async () => {
      const result = await client.callTool({
        name: 'get_domestic_sigmets',
        arguments: {  }
        //responseType: 'json' // this is not supported by the client
      });
      const content = result.content as Array<{ type: string; text: any }>;
      expect(Array.isArray(content)).toBe(true);
      expect(content[0].type).toBe('text');
      expect(content[0].text).toBeDefined();
      const jsons = JSON.parse(content[0].text);
      expect(Array.isArray(jsons)).toBe(true);
      const sigmet1 = jsons[0];
      if (typeof sigmet1 !== 'undefined') {
        console.log('content-json', sigmet1);
        expect(Number.isInteger(sigmet1.airSigmetId)).toBe(true);
      }
    });

    it('returns results for hazard=turb, level=300', async () => {
      const result = await client.callTool({
        name: 'get_domestic_sigmets',
        arguments: { hazard: 'turb', level: 300 },
       // responseType: 'json',
      });
      const content = result.content as Array<{ type: string; text: any }>;
      expect(Array.isArray(content)).toBe(true);
      expect(content[0].type).toBe('text');
      expect(content[0].text).toBeDefined();
      const jsons = JSON.parse(content[0].text);
      expect(Array.isArray(jsons)).toBe(true);
      const sigmet1 = jsons[0];
      if (typeof sigmet1 !== 'undefined') {
        console.log('content-json', sigmet1);
        expect(Number.isInteger(sigmet1.airSigmetId)).toBe(true);
      }
    });

    it('returns pretty results for hazard=ice, level=200', async () => {
      const result = await client.callTool({
        name: 'get_domestic_sigmets',
        arguments: { hazard: 'ice', level: 200, humanReadable: true },
        // responseType: 'json',
      });
      const content = result.content as Array<{ type: string; text: any }>;
      expect(content).toBeDefined();
      expect(Array.isArray(content)).toBe(true);
      expect(content[0].type).toBe('text');
      expect(content[0].text).toBeDefined();
      const jsons = JSON.parse(content[0].text);
      expect(Array.isArray(jsons)).toBe(true);
      const sigmet1 = jsons[0];
      if (typeof sigmet1 !== 'undefined') {
        console.log('content-json', sigmet1);
        expect(Number.isInteger(sigmet1.airSigmetId)).toBe(true);
      }
    });

    it('throws error for invalid hazard', async () => {
      await expect(client.callTool({
        name: 'get_domestic_sigmets',
        arguments: { hazard: 'invalid_hazard' },
       //  responseType: 'json',
      })).rejects.toThrow();
    });
  });

  describe('get_international_sigmets', () => {
    it('returns results with no arguments', async () => {
      const result = await client.callTool({
        name: 'get_international_sigmets',
        arguments: {},
       // responseType: 'json',
      });
      const content = result.content as Array<{ type: string; text: any }>;
      expect(content).toBeDefined();
      expect(Array.isArray(content)).toBe(true);
      expect(content[0].type).toBe('text');
      expect(content[0].text).toBeDefined();
      const jsons = JSON.parse(content[0].text);
      expect(Array.isArray(jsons)).toBe(true);
      const sigmet1 = jsons[0];
      if (typeof sigmet1 !== 'undefined') {
        console.log('content-json', sigmet1);
        expect(Number.isInteger(sigmet1.isigmetId)).toBe(true); // segment ID is different for international sigmets
      }
    });

    it('returns pretty results for hazard=turb, level=400', async () => {
      const result = await client.callTool({
        name: 'get_international_sigmets',
        arguments: { hazard: 'turb', level: 400, humanReadable: true },
        responseType: 'json',
      });
      const content = result.content as Array<{ type: string; text: any }>;
      expect(content).toBeDefined();
      expect(Array.isArray(content)).toBe(true);
      expect(content[0].type).toBe('text');
      expect(content[0].text).toBeDefined();
      const jsons = JSON.parse(content[0].text);
      expect(Array.isArray(jsons)).toBe(true);
      const sigmet1 = jsons[0];
      if (typeof sigmet1 !== 'undefined') {
        console.log('content-json', sigmet1);
        expect(Number.isInteger(sigmet1.isigmetId)).toBe(true); // segment ID is different for international sigmets
      }
    });

    it('throws error for invalid hazard', async () => {
      await expect(client.callTool({
        name: 'get_international_sigmets',
        arguments: { hazard: 'bad' },
        responseType: 'text',
      })).rejects.toThrow();
    });
  });

  test('throws error for unknown tool', async () => {
    await expect(client.callTool({
      name: 'unknown_tool',
      arguments: {},
      responseType: 'text',
    })).rejects.toThrow();
  });
}); 