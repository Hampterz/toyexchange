// This file is loaded via --require and registers path variables for CommonJS compatibility
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { createRequire } from 'module';

// Create ES module compatible paths and globals
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create require function
const require = createRequire(import.meta.url);

// Define globals
global.__filename = __filename;
global.__dirname = __dirname;
global.require = require;

// Define path constants
global.ROOT_DIR = __dirname;
global.CLIENT_DIR = resolve(__dirname, 'client');
global.CLIENT_SRC = resolve(__dirname, 'client/src');
global.SHARED_DIR = resolve(__dirname, 'shared');

console.log('Registered global path variables for ES module compatibility');