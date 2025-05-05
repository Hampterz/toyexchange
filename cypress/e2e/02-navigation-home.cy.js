describe('Navigation and Home Page Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Loads the home page successfully', () => {
    cy.get('h1, h2').should('be.visible');
    cy.checkPageErrors();
  });

  it('Has a working navigation menu', () => {
    // Test all navigation links
    cy.get('nav a, nav button').each(($el) => {
      const text = $el.text().trim();
      
      // Skip logout button for now
      if (!/logout|sign out/i.test(text)) {
        cy.wrap($el).click({ force: true });
        
        // Wait for page to load
        cy.wait(1000);
        
        // Go back to home for next link test
        cy.go('back');
      }
    });
  });

  it('Tests search functionality', () => {
    // Find and use the search input
    cy.get('input[type="search"], input[placeholder*="search"]').type('toy{enter}');
    
    // Verify search results or search page loaded
    cy.url().should('include', 'search');
    cy.get('body').should('not.contain', 'Error');
  });

  it('Tests filter functionality', () => {
    // Open filters if they're in a collapsed state
    cy.get('body').then($body => {
      if ($body.find('[aria-label="Filters"], button:contains("Filter")').length > 0) {
        cy.get('[aria-label="Filters"], button:contains("Filter")').first().click();
      }
    });
    
    // Test category filter if it exists
    cy.get('body').then($body => {
      if ($body.find('select[name="category"], [id*="category"]').length > 0) {
        cy.get('select[name="category"], [id*="category"]').first().click();
        cy.contains(/educational|toys|games/i).click();
      }
    });
    
    // Test age range filter if it exists
    cy.get('body').then($body => {
      if ($body.find('input[name="ageRange"], [id*="age"]').length > 0) {
        cy.get('input[name="ageRange"], [id*="age"]').first().type('3-5');
      }
    });
    
    // Apply filters
    cy.get('button').contains(/apply|filter|search/i).click();
    
    // Verify filtered results
    cy.wait(1000);
    cy.get('body').should('not.contain', 'Error');
  });

  it('Tests location search functionality', () => {
    // Find and use location input if it exists
    cy.get('body').then($body => {
      if ($body.find('input[name="location"], input[placeholder*="location"]').length > 0) {
        cy.get('input[name="location"], input[placeholder*="location"]').first().type('New York{enter}');
        
        // Apply location filter
        cy.get('button').contains(/apply|search|go/i).click();
        
        // Verify location search worked
        cy.wait(1000);
        cy.get('body').should('not.contain', 'Error');
      }
    });
  });

  it('Tests footer links', () => {
    // Test each footer link
    cy.get('footer a').each(($el) => {
      const href = $el.prop('href');
      
      // Only test internal links
      if (href && href.includes(Cypress.config().baseUrl)) {
        cy.wrap($el).click({ force: true });
        cy.go('back');
      }
    });
  });

  it('Tests responsiveness on mobile viewport', () => {
    // Test mobile view
    cy.viewport('iphone-x');
    cy.reload();
    
    // Check mobile menu toggle
    cy.get('body').then($body => {
      if ($body.find('[aria-label="Menu"], .hamburger, .mobile-menu-button').length > 0) {
        cy.get('[aria-label="Menu"], .hamburger, .mobile-menu-button').first().click();
        cy.get('nav').should('be.visible');
      }
    });
    
    // Check content is readable and not overflowing
    cy.get('main, .container, .content').should('be.visible');
    cy.viewport('macbook-15'); // Return to desktop view
  });

  it('Tests authenticated navigation when logged in', () => {
    // Login first
    cy.login('adminsreyas', 'password123');
    cy.visit('/');
    
    // Verify authenticated menu items
    cy.get('nav').should('contain', /profile|account|my toys/i);
    
    // Click on profile or user-specific menu item
    cy.contains(/profile|my toys|dashboard/i).click();
    
    // Verify user-specific page loaded
    cy.get('body').should('contain', /profile|my toys|dashboard/i);
  });
});