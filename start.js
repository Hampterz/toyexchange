// Import ES Module compatibility fix
import './es-module-fix.js';
import { spawn } from 'child_process';

// Set environment variables
process.env.VITE_CONFIG_PATH = './vite.config.compat.mjs';

console.log('Starting ToyShare with ES Module compatibility...');

// Start the application with the ESM-compatible Vite config
const process_env = {
  ...process.env,
  VITE_CONFIG_PATH: './vite.config.compat.mjs'
};

// Use tsx for TypeScript execution with the ESM compatibility
const server = spawn('tsx', ['server/index.ts'], {
  stdio: 'inherit',
  env: process_env
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('Stopping server...');
  server.kill('SIGINT');
});

server.on('close', (code) => {
  console.log(`Server exited with code ${code}`);
  process.exit(code);
});