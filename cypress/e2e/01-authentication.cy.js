describe('Authentication Tests', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it('Loads the auth page successfully', () => {
    cy.visit('/auth');
    cy.get('h1, h2').should('contain', /login|sign in|authentication/i);
    cy.checkPageErrors();
  });

  it('Shows validation errors for empty login form', () => {
    cy.visit('/auth');
    cy.contains(/login|sign in/i).click();
    cy.get('button[type="submit"]').contains(/login|sign in/i).click();
    cy.get('form').should('contain', /required|cannot be empty/i);
  });

  it('Shows error for invalid credentials', () => {
    cy.visit('/auth');
    cy.get('input[name="username"],input[name="email"]').type('nonexistent@user.com');
    cy.get('input[name="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').contains(/login|sign in/i).click();
    cy.get('body').should('contain', /invalid|incorrect|failed/i);
  });

  it('Registers a new user successfully', () => {
    const username = `testuser_${Date.now()}`;
    const email = `test_${Date.now()}@example.com`;
    
    cy.visit('/auth');
    
    // Switch to registration form if needed
    cy.get('button, a').contains(/register|sign up|create account/i).click({force: true});
    
    // Fill out the form
    cy.get('input[name="username"]').type(username);
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="name"]').type('Test User');
    cy.get('input[name="password"]').type('Password123!');
    
    // If there's a location field
    cy.get('body').then($body => {
      if ($body.find('input[name="location"]').length > 0) {
        cy.get('input[name="location"]').type('Test Location');
      }
    });
    
    // Submit the form
    cy.get('button[type="submit"]').contains(/register|sign up|create/i).click();
    
    // Check for success - either redirect to another page or success message
    cy.url().should('not.include', '/auth');
  });

  it('Successfully logs in with valid credentials', () => {
    cy.visit('/auth');
    cy.get('input[name="username"],input[name="email"]').type('adminsreyas');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').contains(/login|sign in/i).click();
    
    // Check we're redirected away from the login page
    cy.url().should('not.include', '/auth');
    
    // Check for user-specific element that indicates logged-in state
    cy.get('nav, header').should('contain', /profile|account|logout/i);
  });

  it('Successfully logs out', () => {
    // Login first
    cy.login('adminsreyas', 'password123');
    cy.visit('/');
    
    // Find and click the logout button
    cy.get('nav, header').contains(/logout|sign out/i).click();
    
    // Verify logged out state - either redirect to login or home with login option visible
    cy.get('nav, header').should('contain', /login|sign in/i);
  });

  it('Tests forgot password flow', () => {
    cy.visit('/auth');
    
    // Navigate to forgot password
    cy.contains(/forgot|reset|password/i).click();
    
    // Enter email for password reset
    cy.get('input[type="email"]').type('test@example.com');
    cy.get('button[type="submit"]').click();
    
    // Verify confirmation message
    cy.contains(/email sent|check your email|reset link/i).should('be.visible');
  });
});