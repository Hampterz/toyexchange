// Development runner with ESM compatibility
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { spawn } from 'child_process';

// Create ES module compatible paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('Starting ToyShare in development mode with ES module compatibility...');
console.log('Working directory:', __dirname);

// Set environment variables
process.env.VITE_CONFIG_PATH = './vite.config.mjs';
process.env.NODE_ENV = 'development';

// Start the server with tsx
const server = spawn('tsx', ['server/index.ts'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    VITE_CONFIG_PATH: './vite.config.mjs',
    NODE_ENV: 'development'
  }
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