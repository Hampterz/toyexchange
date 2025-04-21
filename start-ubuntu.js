#!/usr/bin/env node

/**
 * This is a CommonJS wrapper script for running the ToyShare application in Ubuntu
 * It's compatible with both ES modules and CommonJS environments
 */

const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Define the root directory
const rootDir = path.resolve(__dirname);

// Add application paths to the node process
process.env.ROOT_DIR = rootDir;
process.env.CLIENT_DIR = path.resolve(rootDir, 'client');
process.env.CLIENT_SRC = path.resolve(rootDir, 'client/src');
process.env.SHARED_DIR = path.resolve(rootDir, 'shared');
process.env.ASSETS_DIR = path.resolve(rootDir, 'attached_assets');

console.log('Starting ToyShare application on Ubuntu...');
console.log('Working directory:', rootDir);

// Helper function to run shell commands
function runCommand(command, args, options = {}) {
  console.log(`Running: ${command} ${args.join(' ')}`);
  try {
    execFileSync(command, args, {
      stdio: 'inherit',
      env: {
        ...process.env,
        ...options.env
      },
      ...options
    });
  } catch (error) {
    console.error('Command failed:', error.message);
    process.exit(1);
  }
}

// Check if we need to install node modules
if (!fs.existsSync(path.join(rootDir, 'node_modules'))) {
  console.log('Installing dependencies...');
  runCommand('npm', ['install']);
}

// Run the application based on the environment
if (process.env.NODE_ENV === 'production') {
  console.log('Starting in production mode...');
  runCommand('node', ['dist/index.js'], {
    env: { NODE_ENV: 'production' }
  });
} else {
  console.log('Starting in development mode...');
  runCommand('tsx', ['server/index.ts'], {
    env: { 
      NODE_ENV: 'development',
      // Fix the __dirname issue by defining these options
      NODE_OPTIONS: '--experimental-json-modules --experimental-vm-modules'
    }
  });
}