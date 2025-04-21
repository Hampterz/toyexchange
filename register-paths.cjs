// CommonJS module for registering path variables
const path = require('path');

// Define the project root directory
const rootDir = path.resolve(__dirname);

// Define global variables for path resolution
global.ROOT_DIR = rootDir;
global.CLIENT_DIR = path.join(rootDir, 'client');
global.CLIENT_SRC = path.join(rootDir, 'client', 'src');
global.SHARED_DIR = path.join(rootDir, 'shared');
global.ASSETS_DIR = path.join(rootDir, 'attached_assets');

console.log('Registered path variables with CommonJS compatibility');
console.log('Root directory:', rootDir);