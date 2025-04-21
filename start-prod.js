// Production startup script with ESM compatibility
import './esm-compat.js';
import { spawn } from 'child_process';
import { paths } from './esm-compat.js';
import path from 'path';

console.log('Starting ToyShare production build...');

// Run the production build 
const server = spawn('node', [path.join(paths.dist, 'app.js')], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: 'production'
  },
  cwd: paths.dist
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('Stopping production server...');
  server.kill('SIGINT');
});

server.on('close', (code) => {
  console.log(`Server exited with code ${code}`);
  process.exit(code);
});