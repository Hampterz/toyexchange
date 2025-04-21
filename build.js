// Production build with ESM compatibility
import './esm-compat.js';
import { execSync } from 'child_process';
import fs from 'fs/promises';
import { paths } from './esm-compat.js';
import path from 'path';

console.log('Building ToyShare for production with ES module compatibility...');

// Run Vite build for frontend using our ESM-compatible config
console.log('Building frontend...');
execSync('vite build --config vite.config.mjs', { stdio: 'inherit' });

// Build the backend
console.log('Building backend...');
execSync('esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', { 
  stdio: 'inherit'
});

// Create an ESM-compatible entry point
const entryPointContent = `
// Production ESM-compatible entry point
import './esm-globals.js';
import './index.js';
`;

const esmGlobalsContent = `
// ESM compatibility globals for production
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Create ES Module compatible globals
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Make these available globally
global.__filename = __filename;
global.__dirname = __dirname;

console.log('Production ES Module compatibility initialized');
`;

// Write the entry point files
console.log('Creating production ES module entry points...');
await fs.writeFile(path.join(paths.dist, 'app.js'), entryPointContent);
await fs.writeFile(path.join(paths.dist, 'esm-globals.js'), esmGlobalsContent);

// Create a production package.json
const packageJson = {
  "name": "toyshare-production",
  "version": "1.0.0",
  "type": "module",
  "main": "app.js",
  "scripts": {
    "start": "NODE_ENV=production node app.js"
  }
};

await fs.writeFile(
  path.join(paths.dist, 'package.json'), 
  JSON.stringify(packageJson, null, 2)
);

console.log('Build completed successfully!');
console.log('To run in production:');
console.log('cd dist && NODE_ENV=production node app.js');