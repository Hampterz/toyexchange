/**
 * Simple Testing Script for ToyShare Application
 * 
 * This script performs basic API tests against the ToyShare backend
 * to verify core functionality is working properly.
 */

const { execSync } = require('child_process');

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

// Helper function to make API requests
function apiRequest(method, endpoint, data = null) {
  let command = `curl -s -X ${method} http://localhost:5000${endpoint}`;
  
  if (data) {
    command += ` -H "Content-Type: application/json" -d '${JSON.stringify(data)}'`;
  }
  
  const response = execSync(command).toString();
  return response ? JSON.parse(response) : null;
}

// Helper to assert conditions
function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

// Test authentication
runTest('Unauthenticated user should see public toy listings', () => {
  const toys = apiRequest('GET', '/api/toys');
  assert(Array.isArray(toys), 'Expected toys to be an array');
});

// Test toy details
runTest('Can fetch details for a specific toy', () => {
  // Get the first toy from the list
  const toys = apiRequest('GET', '/api/toys');
  
  if (!toys.length) {
    console.log(`${colors.yellow}⚠ Skipped:${colors.reset} No toys available to test details`);
    skippedTests++;
    return;
  }
  
  const toyId = toys[0].id;
  const toyDetails = apiRequest('GET', `/api/toys/${toyId}`);
  
  assert(toyDetails && toyDetails.id === toyId, 'Failed to fetch toy details');
  assert(typeof toyDetails.title === 'string', 'Toy should have a title');
  assert(typeof toyDetails.description === 'string', 'Toy should have a description');
});

// Test user profile
runTest('Can fetch a user profile', () => {
  const toys = apiRequest('GET', '/api/toys');
  
  if (!toys.length) {
    console.log(`${colors.yellow}⚠ Skipped:${colors.reset} No toys available to test user profile`);
    skippedTests++;
    return;
  }
  
  const userId = toys[0].userId;
  const user = apiRequest('GET', `/api/users/${userId}`);
  
  assert(user && user.id === userId, 'Failed to fetch user profile');
  assert(typeof user.username === 'string', 'User should have a username');
});

// Test community metrics
runTest('Can fetch community metrics', () => {
  const metrics = apiRequest('GET', '/api/community-metrics');
  
  assert(metrics, 'Failed to fetch community metrics');
  assert(typeof metrics.toysSaved === 'number', 'Metrics should include toysSaved');
  assert(typeof metrics.familiesConnected === 'number', 'Metrics should include familiesConnected');
});

// Test wishes endpoint
runTest('Can fetch wishes', () => {
  const wishes = apiRequest('GET', '/api/wishes');
  
  assert(Array.isArray(wishes), 'Expected wishes to be an array');
});

// Print test summary
console.log(`\n${colors.magenta}==== Test Summary =====${colors.reset}`);
console.log(`${colors.green}✓ Passed:${colors.reset} ${passedTests}`);
console.log(`${colors.red}✗ Failed:${colors.reset} ${failedTests}`);
console.log(`${colors.yellow}⚠ Skipped:${colors.reset} ${skippedTests}`);
console.log(`${colors.magenta}=====================${colors.reset}\n`);

// Return appropriate exit code
process.exit(failedTests ? 1 : 0);