#!/usr/bin/env node
// Build script with ES Module compatibility

import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { execSync } from 'child_process';
import fs from 'fs';

// Create ES module compatible paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('Building ToyShare with ES Module compatibility...');

// Run Vite build for the frontend
console.log('Building frontend...');
execSync('vite build', { stdio: 'inherit' });

// Run esbuild for the server
console.log('Building backend...');
execSync(
  'esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist',
  { stdio: 'inherit' }
);

// Create a production entry point that adds ES module compatibility
const productionEntryPoint = `
// ESM compatibility layer for production
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createRequire } from 'module';

// Create ES module compatible globals
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
global.__filename = __filename;
global.__dirname = __dirname;
global.require = createRequire(import.meta.url);

// Run the actual application
import './index.js';
`;

// Write the entry point wrapper
console.log('Creating ES module compatible entry point...');
fs.writeFileSync(resolve(__dirname, 'dist', 'app.js'), productionEntryPoint);

console.log('Build completed successfully!');
console.log('To run the application in production:');
console.log('NODE_ENV=production node dist/app.js');