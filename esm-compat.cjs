// ES Module compatibility layer for Node.js (CommonJS version)
const path = require('path');

// Get the root directory
const __dirname = path.resolve();

// Export paths for CommonJS usage
module.exports = {
  paths: {
    root: __dirname,
    client: path.resolve(__dirname, 'client'),
    clientSrc: path.resolve(__dirname, 'client', 'src'),
    shared: path.resolve(__dirname, 'shared'),
    assets: path.resolve(__dirname, 'attached_assets'),
    dist: path.resolve(__dirname, 'dist'),
    distPublic: path.resolve(__dirname, 'dist', 'public'),
  }
};

console.log('CommonJS ES Module compatibility layer loaded');
console.log('Working directory:', __dirname);