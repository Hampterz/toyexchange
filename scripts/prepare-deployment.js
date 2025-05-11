#!/usr/bin/env node

/**
 * This script prepares the ToyShare application for deployment to a production environment.
 * It removes Replit-specific packages and configurations.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Packages to remove
const packagesToRemove = [
  '@replit/vite-plugin-cartographer',
  '@replit/vite-plugin-runtime-error-modal',
  '@replit/vite-plugin-shadcn-theme-json',
];

console.log('Preparing ToyShare for deployment...');

// Create a clean package.json for production
try {
  const packageJsonPath = path.join(rootDir, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Remove Replit-specific dependencies
  let dependenciesModified = false;
  for (const pkg of packagesToRemove) {
    if (packageJson.dependencies && packageJson.dependencies[pkg]) {
      delete packageJson.dependencies[pkg];
      dependenciesModified = true;
      console.log(`Removed dependency: ${pkg}`);
    }
  }
  
  // Remove Replit-specific devDependencies
  let devDependenciesModified = false;
  for (const pkg of packagesToRemove) {
    if (packageJson.devDependencies && packageJson.devDependencies[pkg]) {
      delete packageJson.devDependencies[pkg];
      devDependenciesModified = true;
      console.log(`Removed devDependency: ${pkg}`);
    }
  }
  
  if (dependenciesModified || devDependenciesModified) {
    // Write the modified package.json to a temp file for deployment
    const deploymentPackageJsonPath = path.join(rootDir, 'package.json.deploy');
    fs.writeFileSync(
      deploymentPackageJsonPath,
      JSON.stringify(packageJson, null, 2)
    );
    console.log(`Created deployment-ready package.json at ${deploymentPackageJsonPath}`);
    console.log('Run the following command to use it for deployment:');
    console.log('mv package.json.deploy package.json');
  } else {
    console.log('No Replit-specific packages found in package.json');
  }
  
  // Create deployment instructions
  console.log('\nDeployment Instructions:');
  console.log('------------------------');
  console.log('1. Build the application: npm run build');
  console.log('2. Ensure all environment variables are set in .env file');
  console.log('3. Start the application: NODE_ENV=production node dist/index.js');
  
} catch (error) {
  console.error('Error preparing for deployment:', error);
  process.exit(1);
}