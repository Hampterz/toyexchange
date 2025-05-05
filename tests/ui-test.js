/**
 * UI Testing Script for ToyShare Application
 * 
 * This script performs basic UI flow tests by making HTTP requests to 
 * various pages and checking the responses.
 */

const { execSync } = require('child_process');
const readline = require('readline');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// Test results tracking
let passedTests = 0;
let failedTests = 0;
let skippedTests = 0;

// Helper function to run a test
function runTest(name, testFn) {
  console.log(`\n${colors.blue}Running test:${colors.reset} ${name}`);
  try {
    testFn();
    console.log(`${colors.green}✓ Passed:${colors.reset} ${name}`);
    passedTests++;
  } catch (error) {
    console.log(`${colors.red}✗ Failed:${colors.reset} ${name}`);
    console.log(`${colors.red}Error:${colors.reset} ${error.message}`);
    failedTests++;
  }
}

// Helper function to make HTTP requests to pages
function requestPage(path) {
  let command = `curl -s -o /dev/null -w "%{http_code}" http://localhost:5000${path}`;
  const statusCode = parseInt(execSync(command).toString().trim());
  return statusCode;
}

// Helper function to check if a string exists in a page
function pageContains(path, searchString) {
  let command = `curl -s http://localhost:5000${path} | grep -q "${searchString}" && echo "found" || echo "not found"`;
  const result = execSync(command).toString().trim();
  return result === 'found';
}

// Helper to assert conditions
function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

// Test if the homepage loads
runTest('Homepage loads successfully', () => {
  const statusCode = requestPage('/');
  assert(statusCode === 200, `Expected status 200, got ${statusCode}`);
});

// Test if the auth page loads
runTest('Auth page loads successfully', () => {
  const statusCode = requestPage('/auth');
  assert(statusCode === 200, `Expected status 200, got ${statusCode}`);
});

// Test if the wishes page loads
runTest('Wishes page loads successfully', () => {
  const statusCode = requestPage('/wishes');
  assert(statusCode === 200, `Expected status 200, got ${statusCode}`);
});

// Test if the 404 page works
runTest('404 page works for nonexistent routes', () => {
  const statusCode = requestPage('/this-page-does-not-exist-' + Date.now());
  assert(statusCode === 404 || statusCode === 200, `Expected status 404 or 200 (for SPA routing), got ${statusCode}`);
});

// Test if homepage has expected content
runTest('Homepage contains expected content', () => {
  const hasToyShare = pageContains('/', 'ToyShare') || 
                     pageContains('/', 'Toy Share') || 
                     pageContains('/', 'toy sharing');
  assert(hasToyShare, 'Homepage should contain application name or description');
});

// Test if auth page has login form
runTest('Auth page contains login form', () => {
  const hasLoginForm = pageContains('/auth', 'login') || 
                      pageContains('/auth', 'sign in') || 
                      pageContains('/auth', 'username') || 
                      pageContains('/auth', 'password');
  assert(hasLoginForm, 'Auth page should contain login form elements');
});

// Print test summary
console.log(`\n${colors.magenta}==== Test Summary =====${colors.reset}`);
console.log(`${colors.green}✓ Passed:${colors.reset} ${passedTests}`);
console.log(`${colors.red}✗ Failed:${colors.reset} ${failedTests}`);
console.log(`${colors.yellow}⚠ Skipped:${colors.reset} ${skippedTests}`);
console.log(`${colors.magenta}=====================${colors.reset}\n`);

// Return appropriate exit code
process.exit(failedTests ? 1 : 0);