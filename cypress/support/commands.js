// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

import 'cypress-file-upload';
import 'cypress-localstorage-commands';

// Login command
Cypress.Commands.add('login', (username = 'testuser', password = 'password123') => {
  cy.session([username, password], () => {
    cy.visit('/auth');
    cy.get('input[name="username"],input[name="email"]').type(username);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').contains(/login|sign in/i).click();
    cy.url().should('not.include', '/auth');
    cy.wait(1000); // Wait for auth to complete
  });
});

// Create a new toy
Cypress.Commands.add('createToy', (toyData) => {
  const defaultToy = {
    title: 'Test Toy',
    description: 'This is a test toy created by Cypress',
    ageRange: '3-8',
    condition: 'Good',
    category: 'Educational',
    location: 'Test Location'
  };
  
  const toy = { ...defaultToy, ...toyData };
  
  cy.visit('/add-toy');
  cy.get('input[name="title"]').type(toy.title);
  cy.get('textarea[name="description"]').type(toy.description);
  cy.get('input[name="ageRange"]').type(toy.ageRange);
  cy.get('input[name="condition"]').type(toy.condition);
  
  // If there's a category dropdown
  cy.get('select[name="category"],div[id*="category"]').then($el => {
    if ($el.is('select')) {
      cy.wrap($el).select(toy.category);
    } else {
      cy.wrap($el).click().find('li').contains(toy.category).click();
    }
  });
  
  cy.get('input[name="location"]').type(toy.location);
  
  // Submit form
  cy.get('button[type="submit"]').click();
  cy.contains('Toy created successfully').should('be.visible');
});

// Upload image helper
Cypress.Commands.add('uploadImage', (inputSelector, fixturePath) => {
  cy.get(inputSelector).attachFile(fixturePath);
});

// Check for page errors
Cypress.Commands.add('checkPageErrors', () => {
  cy.window().then((win) => {
    // Check if any error occurred
    const hasErrors = win.console.error.called || win.console.warn.called;
    expect(hasErrors).to.be.false;
  });
  
  // Check for server error messages in the DOM
  cy.get('body').should('not.contain', 'server error');
  cy.get('body').should('not.contain', '500');
  
  // Check page is not 404
  cy.get('body').should('not.contain', '404');
  cy.get('body').should('not.contain', 'not found');
});

// Helper for checking all links on a page
Cypress.Commands.add('checkAllLinks', () => {
  cy.get('a').each(($a) => {
    const href = $a.prop('href');
    // Only check internal links that are not # anchors
    if (href && href.includes(Cypress.config().baseUrl) && !href.endsWith('#')) {
      cy.request(href).its('status').should('eq', 200);
    }
  });
});

// Test modal functionality
Cypress.Commands.add('testModal', (openButtonSelector, modalContentSelector, closeButtonSelector) => {
  cy.get(openButtonSelector).click();
  cy.get(modalContentSelector).should('be.visible');
  cy.get(closeButtonSelector).click();
  cy.get(modalContentSelector).should('not.be.visible');
});

// Add toy to favorites
Cypress.Commands.add('addToFavorites', (toyCard) => {
  cy.get(toyCard).find('button[aria-label="Add to favorites"],button:contains("Favorite")').click();
  cy.contains('Added to favorites').should('be.visible');
});

// General helper to test button click and check expected outcome
Cypress.Commands.add('testButton', (selector, expectedOutcome) => {
  cy.get(selector).click();
  
  if (typeof expectedOutcome === 'string') {
    cy.contains(expectedOutcome).should('be.visible');
  } else if (typeof expectedOutcome === 'function') {
    expectedOutcome();
  }
});

// Test notification appearance
Cypress.Commands.add('checkToast', (message) => {
  cy.get('.toast, [role="alert"]').should('contain', message);
});