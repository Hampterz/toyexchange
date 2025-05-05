describe('Comprehensive Application Tests', () => {
  beforeEach(() => {
    cy.login('adminsreyas', 'password123');
  });

  it('Tests complete toy sharing flow (post > contact > trade > mark traded)', () => {
    // Step 1: Create a new toy
    const toyTitle = `Flow Test Toy ${Date.now()}`;
    
    cy.visit('/');
    cy.contains(/post toy|add toy|new toy/i).click();
    
    // Fill out the form
    cy.get('input[name="title"]').type(toyTitle);
    cy.get('textarea[name="description"]').type('This is a flow test toy created by Cypress');
    cy.get('input[name="ageRange"]').type('3-8');
    cy.get('input[name="condition"]').type('Excellent');
    
    // If there's a category dropdown
    cy.get('body').then($body => {
      if ($body.find('select[name="category"]').length > 0) {
        cy.get('select[name="category"]').select('Educational');
      } else if ($body.find('[id*="category"]').length > 0) {
        cy.get('[id*="category"]').click().contains('Educational').click();
      }
    });
    
    // Submit form
    cy.get('button[type="submit"]').click();
    
    // Verify success
    cy.contains(/success|created|added/i).should('be.visible');
    
    // Step 2: Verify toy appears in active toys on profile
    cy.visit('/profile');
    cy.contains(toyTitle).should('be.visible');
    
    // Step 3: Mark toy as traded
    cy.contains(toyTitle).parent().find('button:contains("Mark as Traded")').click();
    
    // Confirm if needed
    cy.get('body').then($body => {
      if ($body.find('button:contains("Confirm"), button:contains("Yes")').length > 0) {
        cy.get('button:contains("Confirm"), button:contains("Yes")').click();
      }
    });
    
    // Verify success
    cy.contains(/traded|success/i).should('be.visible');
    
    // Step 4: Verify toy appears in traded tab
    cy.contains(/traded|completed/i).click();
    cy.contains(toyTitle).should('be.visible');
    
    // Step 5: Reactivate the toy
    cy.contains(toyTitle).parent().find('button:contains("Reactivate"), button:contains("Make Active")').click();
    
    // Confirm if needed
    cy.get('body').then($body => {
      if ($body.find('button:contains("Confirm"), button:contains("Yes")').length > 0) {
        cy.get('button:contains("Confirm"), button:contains("Yes")').click();
      }
    });
    
    // Verify success
    cy.contains(/reactivated|success/i).should('be.visible');
    
    // Step 6: Delete the test toy to clean up
    cy.contains(/active/i).click();
    cy.contains(toyTitle).parent().find('[data-cy="delete-toy"], button:contains("Delete"), [aria-label="Delete"]').click();
    
    // Confirm deletion
    cy.get('button:contains("Delete"), button:contains("Yes"), button:contains("Confirm")').click();
    
    // Verify success
    cy.contains(/deleted|removed|success/i).should('be.visible');
  });

  it('Tests search and filtering across the application', () => {
    // Test search on home page
    cy.visit('/');
    
    // Test basic search
    cy.get('input[type="search"], input[placeholder*="search"]').type('toy{enter}');
    cy.wait(1000);
    
    // Test filtering by category
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
        
        // Apply filters
        cy.get('button').contains(/apply|filter|search/i).click();
        cy.wait(1000);
      }
    });
    
    // Test filtering by age range
    cy.get('body').then($body => {
      if ($body.find('[aria-label="Filters"], button:contains("Filter")').length > 0) {
        cy.get('[aria-label="Filters"], button:contains("Filter")').first().click();
      }
    });
    
    cy.get('body').then($body => {
      if ($body.find('input[name="ageRange"], [id*="age"]').length > 0) {
        cy.get('input[name="ageRange"], [id*="age"]').first().type('3-5');
        
        // Apply filters
        cy.get('button').contains(/apply|filter|search/i).click();
        cy.wait(1000);
      }
    });
    
    // Test filtering by condition
    cy.get('body').then($body => {
      if ($body.find('[aria-label="Filters"], button:contains("Filter")').length > 0) {
        cy.get('[aria-label="Filters"], button:contains("Filter")').first().click();
      }
    });
    
    cy.get('body').then($body => {
      if ($body.find('select[name="condition"], [id*="condition"]').length > 0) {
        cy.get('select[name="condition"], [id*="condition"]').first().click();
        cy.contains(/excellent|good|fair/i).click();
        
        // Apply filters
        cy.get('button').contains(/apply|filter|search/i).click();
        cy.wait(1000);
      }
    });
    
    // Test filtering by location/distance
    cy.get('body').then($body => {
      if ($body.find('[aria-label="Filters"], button:contains("Filter")').length > 0) {
        cy.get('[aria-label="Filters"], button:contains("Filter")').first().click();
      }
    });
    
    cy.get('body').then($body => {
      if ($body.find('input[name="location"], input[placeholder*="location"]').length > 0) {
        cy.get('input[name="location"], input[placeholder*="location"]').clear().type('San Francisco, CA');
        
        // If there's a distance slider or input
        if ($body.find('input[type="range"], input[name="distance"]').length > 0) {
          cy.get('input[type="range"], input[name="distance"]').invoke('val', 25).trigger('change');
        }
        
        // Apply filters
        cy.get('button').contains(/apply|filter|search/i).click();
        cy.wait(1000);
      }
    });
    
    // Reset filters
    cy.get('body').then($body => {
      if ($body.find('button:contains("Reset"), button:contains("Clear")').length > 0) {
        cy.get('button:contains("Reset"), button:contains("Clear")').click();
        cy.wait(1000);
      }
    });
  });

  it('Tests user interface responsiveness', () => {
    // Test different device viewports
    const viewports = [
      'iphone-6',      // Small mobile
      'ipad-2',        // Tablet
      'macbook-13',    // Small desktop
      [1920, 1080]     // Large desktop
    ];
    
    viewports.forEach(viewport => {
      // Set viewport
      if (Array.isArray(viewport)) {
        cy.viewport(viewport[0], viewport[1]);
      } else {
        cy.viewport(viewport);
      }
      
      // Visit home page
      cy.visit('/');
      cy.wait(500);
      
      // Check navigation is visible or has a mobile toggle
      cy.get('body').then($body => {
        if ($body.find('[aria-label="Menu"], .hamburger, .mobile-menu-button').length > 0) {
          cy.get('[aria-label="Menu"], .hamburger, .mobile-menu-button').should('be.visible');
          
          // Test opening mobile menu
          cy.get('[aria-label="Menu"], .hamburger, .mobile-menu-button').first().click();
          cy.get('nav').should('be.visible');
          
          // Close mobile menu if there's a close button
          cy.get('body').then($body => {
            if ($body.find('[aria-label="Close menu"], button:contains("Close")').length > 0) {
              cy.get('[aria-label="Close menu"], button:contains("Close")').click();
            }
          });
        } else {
          // Desktop nav should be visible
          cy.get('nav').should('be.visible');
        }
      });
      
      // Check toy cards layout
      cy.get('[data-cy="toy-card"], .toy-card, .card').then($cards => {
        if ($cards.length > 0) {
          // Cards should be visible and have appropriate sizing
          cy.get('[data-cy="toy-card"], .toy-card, .card').should('be.visible');
          
          // On smaller screens, cards should be stacked
          if (['iphone-6', 'ipad-2'].includes(viewport)) {
            // We can't directly check CSS, but we can check if elements are stacked
            // by comparing their y positions
            cy.get('[data-cy="toy-card"], .toy-card, .card').first().then($first => {
              const firstRect = $first[0].getBoundingClientRect();
              cy.get('[data-cy="toy-card"], .toy-card, .card').eq(1).then($second => {
                if ($second.length) {
                  const secondRect = $second[0].getBoundingClientRect();
                  // If they're stacked, the second should be below the first
                  expect(secondRect.top).to.be.greaterThan(firstRect.bottom - 20);
                }
              });
            });
          }
        }
      });
    });
    
    // Return to default viewport
    cy.viewport('macbook-15');
  });

  it('Tests error handling and validation', () => {
    // Test form validation on toy creation
    cy.visit('/');
    cy.contains(/post toy|add toy|new toy/i).click();
    
    // Submit empty form to trigger validation
    cy.get('button[type="submit"]').click();
    
    // Check validation errors
    cy.get('form').should('contain', /required|cannot be empty/i);
    
    // Test invalid input
    cy.get('input[name="title"]').type('a'); // Too short
    cy.get('button[type="submit"]').click();
    cy.get('form').should('contain', /short|minimum|characters/i);
    
    // Cancel form
    cy.get('body').then($body => {
      if ($body.find('button:contains("Cancel"), [aria-label="Cancel"]').length > 0) {
        cy.get('button:contains("Cancel"), [aria-label="Cancel"]').click();
      } else {
        cy.go('back');
      }
    });
    
    // Test invalid URL access
    cy.visit('/nonexistent-page');
    cy.get('body').should('contain', /not found|404|doesn't exist/i);
  });

  it('Tests social sharing functionality if available', () => {
    // Visit a toy detail page
    cy.visit('/');
    cy.get('[data-cy="toy-card"], .toy-card, .card').first().click();
    
    // Check for share buttons
    cy.get('body').then($body => {
      if ($body.find('button:contains("Share"), [aria-label="Share"]').length > 0) {
        cy.get('button:contains("Share"), [aria-label="Share"]').click();
        
        // Verify share options appear
        cy.get('body').should('contain', /facebook|twitter|email|link/i);
        
        // Test copy link if available
        cy.get('body').then($body => {
          if ($body.find('button:contains("Copy"), button:contains("Link")').length > 0) {
            cy.get('button:contains("Copy"), button:contains("Link")').click();
            
            // Verify success message for copy
            cy.contains(/copied|clipboard/i).should('be.visible');
          }
        });
        
        // Close share dialog
        cy.get('body').then($body => {
          if ($body.find('button:contains("Close"), [aria-label="Close"]').length > 0) {
            cy.get('button:contains("Close"), [aria-label="Close"]').click();
          }
        });
      } else {
        cy.log('Share functionality not found');
      }
    });
  });

  it('Tests accessibility features', () => {
    // Visit home page
    cy.visit('/');
    
    // Check for semantic HTML
    cy.get('main').should('exist');
    cy.get('nav').should('exist');
    cy.get('header').should('exist');
    cy.get('footer').should('exist');
    
    // Check for proper heading structure
    cy.get('h1').should('exist');
    
    // Test keyboard navigation
    cy.get('body').type('{tab}');
    cy.focused().should('be.visible').and('have.attr', 'tabindex');
    
    // Navigate through multiple elements with tab
    for (let i = 0; i < 5; i++) {
      cy.focused().type('{tab}');
      cy.focused().should('be.visible');
    }
    
    // Check for ARIA attributes on interactive elements
    cy.get('[role="button"], [role="tab"], [role="dialog"]').each($el => {
      // Interactive elements should have accessible names
      cy.wrap($el).should('satisfy', $el => {
        return $el.attr('aria-label') || $el.text().trim().length > 0;
      });
    });
  });
});