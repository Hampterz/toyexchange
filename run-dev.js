#!/usr/bin/env node

// This script helps start the application with ES module compatibility
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { spawn } from 'child_process';

// Create ES module compatible paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create a process environment with global variables
const env = {
  ...process.env,
  // Make paths available as environment variables
  ROOT_DIR: __dirname,
  CLIENT_DIR: resolve(__dirname, 'client'),
  CLIENT_SRC: resolve(__dirname, 'client/src'),
  SHARED_DIR: resolve(__dirname, 'shared'),
  NODE_ENV: 'development'
};

console.log('Starting ToyShare with ES module compatibility...');
console.log('Root directory:', __dirname);

// Start the server using tsx
const server = spawn('tsx', [
  // Add the Node.js flag to define global variables
  '--require', './register-paths.cjs',
  'server/index.ts'
], {
  stdio: 'inherit',
  env
});

// Handle termination
process.on('SIGINT', () => {
  console.log('Stopping server...');
  server.kill('SIGINT');
});

server.on('close', (code) => {
  console.log(`Server exited with code ${code}`);
  process.exit(code);
});