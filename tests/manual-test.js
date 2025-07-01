#!/usr/bin/env node

import { spawn } from 'child_process';
import readline from 'readline';

console.log('🧪 Manual MCP Server Test');
console.log('========================');

// Start the MCP server
const serverProcess = spawn('node', ['dist/index.js'], {
  stdio: ['pipe', 'pipe', 'pipe']
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Helper function to get current date in the required format
function getCurrentDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}${month}${day}_000000Z`;
}

// Function to display available commands
function displayCommands() {
  console.log('Available commands:');
  console.log('  list-tools - List available tools');
  console.log('  domestic [date] [hazard] [level] - Test domestic SIGMETs');
  console.log('    date: YYYYMMDD_HHMMSSZ (defaults to current date)');
  console.log('    hazard: conv, turb, ice, ifr (optional)');
  console.log('    level: 0-600 (optional)');
  console.log('  international [date] [hazard] [level] - Test international SIGMETs');
  console.log('    date: YYYYMMDD_HHMMSSZ (defaults to current date)');
  console.log('    hazard: turb, ice (optional)');
  console.log('    level: 0-600 (optional)');
  console.log('  clear - Clear console and show commands');
  console.log('  quit - Exit the test');
  console.log('');
  console.log('Examples:');
  console.log('  domestic                           # Current date only');
  console.log('  domestic 20250630_000000Z         # Specific date only');
  console.log('  domestic 20250630_000000Z turb    # Date + hazard');
  console.log('  domestic 20250630_000000Z turb 300 # Date + hazard + level');
  console.log('  domestic turb 300                 # Current date + hazard + level');
}

console.log('MCP Server started. You can now test it manually.');
displayCommands();

rl.on('line', (input) => {
  const [command, ...args] = input.trim().split(' ');
  
  switch (command) {
    case 'list-tools':
      console.log('Listing tools...');
      // Send MCP list tools request
      const listRequest = {
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/list',
        params: {}
      };
      serverProcess.stdin.write(JSON.stringify(listRequest) + '\n');
      break;
      
    case 'domestic':
      let date = getCurrentDate();
      let hazard = undefined;
      let level = undefined;
      
      // Parse arguments: [date] [hazard] [level]
      if (args.length > 0) {
        // Check if first argument looks like a date (contains underscore and Z)
        if (args[0].includes('_') && args[0].endsWith('Z')) {
          date = args[0];
          hazard = args[1] || undefined;
          level = args[2] ? parseInt(args[2]) : undefined;
        } else {
          // First argument is not a date, treat as hazard
          hazard = args[0];
          level = args[1] ? parseInt(args[1]) : undefined;
        }
      }
      
      console.log(`Testing domestic SIGMETs with date=${date}${hazard ? `, hazard=${hazard}` : ''}${level ? `, level=${level}` : ''}...`);
      
      const domesticArgs = {
        date: date,
        humanReadable: true
      };
      
      if (hazard) {
        domesticArgs.hazard = hazard;
      }
      if (level) {
        domesticArgs.level = level;
      }
      
      const domesticRequest = {
        jsonrpc: '2.0',
        id: 2,
        method: 'tools/call',
        params: {
          name: 'get_domestic_sigmets',
          arguments: domesticArgs
        }
      };
      serverProcess.stdin.write(JSON.stringify(domesticRequest) + '\n');
      break;
      
    case 'international':
      let intDate = getCurrentDate();
      let intHazard = undefined;
      let intLevel = undefined;
      
      // Parse arguments: [date] [hazard] [level]
      if (args.length > 0) {
        // Check if first argument looks like a date (contains underscore and Z)
        if (args[0].includes('_') && args[0].endsWith('Z')) {
          intDate = args[0];
          intHazard = args[1] || undefined;
          intLevel = args[2] ? parseInt(args[2]) : undefined;
        } else {
          // First argument is not a date, treat as hazard
          intHazard = args[0];
          intLevel = args[1] ? parseInt(args[1]) : undefined;
        }
      }
      
      console.log(`Testing international SIGMETs with date=${intDate}${intHazard ? `, hazard=${intHazard}` : ''}${intLevel ? `, level=${intLevel}` : ''}...`);
      
      const internationalArgs = {
        date: intDate,
        humanReadable: true
      };
      
      if (intHazard) {
        internationalArgs.hazard = intHazard;
      }
      if (intLevel) {
        internationalArgs.level = intLevel;
      }
      
      const internationalRequest = {
        jsonrpc: '2.0',
        id: 3,
        method: 'tools/call',
        params: {
          name: 'get_international_sigmets',
          arguments: internationalArgs
        }
      };
      serverProcess.stdin.write(JSON.stringify(internationalRequest) + '\n');
      break;
      
    case 'clear':
      // Clear console (works on most terminals)
      console.clear();
      console.log('🧪 Manual MCP Server Test');
      console.log('========================');
      console.log('MCP Server started. You can now test it manually.');
      displayCommands();
      break;
      
    case 'quit':
      console.log('Exiting...');
      serverProcess.kill();
      rl.close();
      process.exit(0);
      break;
      
    default:
      console.log('Unknown command. Type "clear" to see commands or "quit" to exit.');
  }
});

// Handle server output
serverProcess.stdout.on('data', (data) => {
  try {
    const response = JSON.parse(data.toString());
    console.log('📄 Server Response:', JSON.stringify(response, null, 2));
  } catch (error) {
    console.log('📄 Raw server output:', data.toString());
  }
});

serverProcess.stderr.on('data', (data) => {
  const message = data.toString().trim();
  // Only show actual errors, not startup messages
  if (!message.includes('MCP SIGMET server started')) {
    console.log('❌ Server Error:', message);
  }
});

serverProcess.on('close', (code) => {
  console.log(`🔌 Server process exited with code ${code}`);
  rl.close();
  process.exit(code);
});

console.log('\nType a command to test the MCP server:'); 