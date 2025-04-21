// ES Module compatibility fix
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Create ES Module compatible paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Export paths for use in other files
export const paths = {
  root: __dirname,
  client: resolve(__dirname, 'client'),
  clientSrc: resolve(__dirname, 'client', 'src'),
  shared: resolve(__dirname, 'shared'),
  assets: resolve(__dirname, 'attached_assets'),
  dist: resolve(__dirname, 'dist'),
  distPublic: resolve(__dirname, 'dist', 'public'),
};

// Log initialization
console.log('ES Module compatibility fix loaded');
console.log('Working directory:', __dirname);