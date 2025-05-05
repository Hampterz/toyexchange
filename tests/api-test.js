/**
 * API Testing Script for ToyShare Application
 * 
 * This script tests the API endpoints using node-fetch.
 */

const fetch = require('node-fetch');

// Test configuration
const BASE_URL = 'http://localhost:5000';
let testToken = null;

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
async function runTest(name, testFn) {
  console.log(`\n${colors.blue}Running test:${colors.reset} ${name}`);
  try {
    await testFn();
    console.log(`${colors.green}✓ Passed:${colors.reset} ${name}`);
    passedTests++;
  } catch (error) {
    console.log(`${colors.red}✗ Failed:${colors.reset} ${name}`);
    console.log(`${colors.red}Error:${colors.reset} ${error.message}`);
    failedTests++;
  }
}

// Helper function to make API requests
async function apiRequest(method, endpoint, data = null, token = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (token) {
    options.headers.Authorization = `Bearer ${token}`;
  }

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, options);
  const contentType = response.headers.get('content-type');
  
  if (contentType && contentType.includes('application/json')) {
    return {
      status: response.status,
      data: await response.json(),
    };
  } else {
    return {
      status: response.status,
      data: await response.text(),
    };
  }
}

// Helper to assert conditions
function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

// Main test function
async function runTests() {
  // Test public endpoints
  await runTest('Get public toy listings', async () => {
    const response = await apiRequest('GET', '/api/toys');
    assert(response.status === 200, `Expected status 200, got ${response.status}`);
    assert(Array.isArray(response.data), 'Expected toys to be an array');
  });

  await runTest('Get community metrics', async () => {
    const response = await apiRequest('GET', '/api/community-metrics');
    assert(response.status === 200, `Expected status 200, got ${response.status}`);
    assert(typeof response.data === 'object', 'Expected metrics to be an object');
    assert(typeof response.data.toysSaved === 'number', 'Expected toysSaved to be a number');
  });

  // Test toy details if there are any toys
  const toysResponse = await apiRequest('GET', '/api/toys');
  if (toysResponse.data.length > 0) {
    const toyId = toysResponse.data[0].id;
    
    await runTest(`Get details for toy ID ${toyId}`, async () => {
      const response = await apiRequest('GET', `/api/toys/${toyId}`);
      assert(response.status === 200, `Expected status 200, got ${response.status}`);
      assert(response.data.id === toyId, 'Expected to get the correct toy');
    });

    const userId = toysResponse.data[0].userId;
    
    await runTest(`Get user profile for ID ${userId}`, async () => {
      const response = await apiRequest('GET', `/api/users/${userId}`);
      assert(response.status === 200, `Expected status 200, got ${response.status}`);
      assert(response.data.id === userId, 'Expected to get the correct user');
    });
  }

  // Test login with wrong credentials
  await runTest('Login with invalid credentials should fail', async () => {
    const response = await apiRequest('POST', '/api/login', {
      username: 'nonexistent_user',
      password: 'wrong_password',
    });
    assert(response.status === 401 || response.status === 400, 
      `Expected status 401 or 400, got ${response.status}`);
  });

  // Test wishes endpoint
  await runTest('Get wishes', async () => {
    const response = await apiRequest('GET', '/api/wishes');
    assert(response.status === 200, `Expected status 200, got ${response.status}`);
    assert(Array.isArray(response.data), 'Expected wishes to be an array');
  });

  // Print test summary
  console.log(`\n${colors.magenta}==== Test Summary =====${colors.reset}`);
  console.log(`${colors.green}✓ Passed:${colors.reset} ${passedTests}`);
  console.log(`${colors.red}✗ Failed:${colors.reset} ${failedTests}`);
  console.log(`${colors.yellow}⚠ Skipped:${colors.reset} ${skippedTests}`);
  console.log(`${colors.magenta}=====================${colors.reset}\n`);

  return failedTests === 0;
}

// Run the tests
runTests()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error(`${colors.red}Test runner error:${colors.reset}`, error);
    process.exit(1);
  });