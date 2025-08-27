#!/usr/bin/env node

const { spawn } = require('child_process');
const { join } = require('path');

console.log('🚀 Starting Kaito Yaps Proxy Development Server...\n');

// Start Vercel dev server
const vercelProcess = spawn('npx', ['vercel', 'dev'], {
  cwd: join(__dirname, '..'),
  stdio: 'inherit'
});

vercelProcess.on('close', (code) => {
  console.log(`\n📦 Vercel dev server exited with code ${code}`);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down development server...');
  vercelProcess.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down development server...');
  vercelProcess.kill('SIGTERM');
  process.exit(0);
}); 