#!/usr/bin/env node

// Simple debug wrapper for the test file
const { spawn } = require('child_process');
const path = require('path');

const testFile = path.join(__dirname, 'tests', 'test-api.ts');

console.log('Starting debug session for:', testFile);

const child = spawn('npx', ['tsx', testFile], {
  stdio: 'inherit',
  env: { ...process.env, NODE_ENV: 'development' }
});

child.on('close', (code) => {
  console.log(`Debug session ended with code ${code}`);
  process.exit(code);
});

child.on('error', (error) => {
  console.error('Failed to start debug session:', error);
  process.exit(1);
}); 