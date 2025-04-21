// ES Module compatibility layer for Node.js
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Create ES Module compatible paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Make these available globally
global.__filename = __filename;
global.__dirname = __dirname;

// Path utilities for the application
export const paths = {
  root: __dirname,
  client: resolve(__dirname, 'client'),
  clientSrc: resolve(__dirname, 'client', 'src'),
  shared: resolve(__dirname, 'shared'),
  assets: resolve(__dirname, 'attached_assets'),
  dist: resolve(__dirname, 'dist'),
  distPublic: resolve(__dirname, 'dist', 'public'),
};

console.log('ES Module compatibility layer loaded');
console.log('Working directory:', __dirname);