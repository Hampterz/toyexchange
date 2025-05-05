# ToyShare Cypress Testing Suite

This directory contains automated end-to-end tests for the ToyShare application using Cypress.

## Test Structure

The tests are organized in a logical progression from basic functionality to more complex scenarios:

1. **Authentication** (`01-authentication.cy.js`): Tests login, registration, and authentication flows
2. **Navigation & Home** (`02-navigation-home.cy.js`): Tests basic navigation and home page functionality
3. **Toy Listings** (`03-toy-listings.cy.js`): Tests creating, viewing, editing, and managing toy listings
4. **Wishes** (`04-wishes.cy.js`): Tests the wish list functionality
5. **Messaging** (`05-messaging.cy.js`): Tests the messaging and conversation system
6. **Profile** (`06-profile.cy.js`): Tests profile viewing and editing functionality
7. **Comprehensive** (`07-comprehensive.cy.js`): End-to-end flows and cross-cutting concerns

## Custom Commands

The test suite includes several custom Cypress commands to make tests more readable and maintainable:

- `login()`: Handles authentication
- `createToy()`: Creates a toy listing
- `uploadImage()`: Handles file uploads
- `checkPageErrors()`: Verifies no console errors or critical issues
- `checkAllLinks()`: Tests that all links on a page work
- `testModal()`: Tests modal dialogs
- `addToFavorites()`: Tests favoriting functionality
- `testButton()`: General button testing helper
- `checkToast()`: Verifies toast notifications

## Running Tests

To run all tests:

```bash
npx cypress run
```

To open the Cypress Test Runner UI:

```bash
npx cypress open
```

## Test Data Approach

Tests are designed to be non-destructive to existing data where possible. Test data is:

1. Created at the beginning of tests that need it
2. Cleaned up after tests when appropriate
3. Using timestamp-based naming to avoid conflicts

## Known Limitations

- Some tests may fail if the environment lacks specific data (e.g., existing messages, toys)
- Tests assume the default test user "adminsreyas" exists with password "password123"
- Image upload tests use a placeholder .txt file instead of an actual image

## Adding New Tests

When adding new tests:

1. Follow the existing pattern of describe/it blocks
2. Use custom commands where appropriate
3. Add resilience by checking if elements exist before interacting
4. Clean up any test data you create
5. Update this README with new information as needed