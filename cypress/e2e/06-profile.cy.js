describe('Profile Page Tests', () => {
  beforeEach(() => {
    cy.login('adminsreyas', 'password123');
  });

  it('Successfully loads the profile page', () => {
    cy.visit('/profile');
    cy.get('h1, h2').should('contain', /profile|account/i);
    cy.checkPageErrors();
  });

  it('Shows active toys tab by default', () => {
    cy.visit('/profile');
    cy.get('[role="tab"][aria-selected="true"]').should('contain', /active|my toys/i);
    
    // Check if toys are displayed
    cy.get('body').then($body => {
      if ($body.find('[data-cy="toy-card"], .toy-card, .card').length > 0) {
        cy.get('[data-cy="toy-card"], .toy-card, .card').should('be.visible');
      } else {
        cy.get('body').should('contain', /no toys|empty|add your first toy/i);
      }
    });
  });

  it('Tests traded toys tab functionality', () => {
    cy.visit('/profile');
    
    // Click on traded tab
    cy.get('[role="tab"]').contains(/traded|completed/i).click();
    
    // Verify tab content changed
    cy.get('[role="tabpanel"]').should('be.visible');
    
    // Check if traded toys exist
    cy.get('body').then($body => {
      if ($body.find('[data-cy="toy-card"], .toy-card, .card').length > 0) {
        cy.get('[data-cy="toy-card"], .toy-card, .card').should('be.visible');
        
        // Test Reactivate button if present
        if ($body.find('button:contains("Reactivate"), button:contains("Make Active")').length > 0) {
          cy.get('button:contains("Reactivate"), button:contains("Make Active")').first().click();
          
          // Confirm action if needed
          cy.get('body').then($body2 => {
            if ($body2.find('button:contains("Confirm"), button:contains("Yes")').length > 0) {
              cy.get('button:contains("Confirm"), button:contains("Yes")').click();
            }
          });
          
          // Verify success
          cy.contains(/reactivated|success/i).should('be.visible');
        }
      } else {
        cy.get('body').should('contain', /no traded toys|empty/i);
      }
    });
  });

  it('Tests inactive toys tab functionality', () => {
    cy.visit('/profile');
    
    // Click on inactive tab
    cy.get('[role="tab"]').contains(/inactive/i).click();
    
    // Verify tab content changed
    cy.get('[role="tabpanel"]').should('be.visible');
    
    // Check if inactive toys exist
    cy.get('body').then($body => {
      if ($body.find('[data-cy="toy-card"], .toy-card, .card').length > 0) {
        cy.get('[data-cy="toy-card"], .toy-card, .card').should('be.visible');
        
        // Test Reactivate button if present
        if ($body.find('button:contains("Reactivate")').length > 0) {
          cy.get('button:contains("Reactivate")').first().click();
          
          // Confirm action if needed
          cy.get('body').then($body2 => {
            if ($body2.find('button:contains("Confirm"), button:contains("Yes")').length > 0) {
              cy.get('button:contains("Confirm"), button:contains("Yes")').click();
            }
          });
          
          // Verify success
          cy.contains(/reactivated|success/i).should('be.visible');
        }
      } else {
        cy.get('body').should('contain', /no inactive toys|empty/i);
      }
    });
  });

  it('Tests profile customization functionality', () => {
    cy.visit('/profile');
    
    // Click on edit profile button
    cy.get('button:contains("Edit Profile"), button:contains("Customize"), [aria-label="Edit profile"]').click();
    
    // Update profile information
    cy.get('input[name="name"]').clear().type('Updated Test Name');
    
    // Update bio if present
    cy.get('body').then($body => {
      if ($body.find('textarea[name="bio"]').length > 0) {
        cy.get('textarea[name="bio"]').clear().type('This is an updated test bio from Cypress');
      }
    });
    
    // Update location if present
    cy.get('body').then($body => {
      if ($body.find('input[name="location"]').length > 0) {
        cy.get('input[name="location"]').clear().type('Updated Test Location');
      }
    });
    
    // Update profile picture if upload field exists
    cy.get('body').then($body => {
      if ($body.find('input[type="file"]').length > 0) {
        cy.get('input[type="file"]').first().attachFile('test-image.txt');
      }
    });
    
    // Save changes
    cy.get('button[type="submit"], button:contains("Save")').click();
    
    // Verify successful update
    cy.contains(/updated|success|saved/i).should('be.visible');
    
    // Verify changes appear on profile
    cy.contains('Updated Test Name').should('be.visible');
  });

  it('Tests viewing profile statistics', () => {
    cy.visit('/profile');
    
    // Check if stats section exists
    cy.get('body').then($body => {
      if ($body.find('[data-cy="profile-stats"], .stats, .metrics').length > 0) {
        cy.get('[data-cy="profile-stats"], .stats, .metrics').should('be.visible');
        
        // Check for common stats labels
        cy.get('[data-cy="profile-stats"], .stats, .metrics').should('contain', /toys|sustainability|rating/i);
      } else {
        cy.log('Profile statistics section not found');
      }
    });
  });

  it('Tests viewing other user profiles', () => {
    // Create an array of user profile URLs to test
    // The first is the current user profile for reference
    const profileUrls = [
      '/profile',
      '/users/8' // Sreyas (from logs)
    ];
    
    // Visit each profile
    profileUrls.forEach(url => {
      cy.visit(url);
      
      // Verify profile content loads
      cy.get('h1, h2').should('contain', /profile|toys|account/i);
      
      // Check if toys are displayed
      cy.get('body').then($body => {
        if ($body.find('[data-cy="toy-card"], .toy-card, .card').length > 0) {
          cy.get('[data-cy="toy-card"], .toy-card, .card').should('be.visible');
        } else {
          cy.get('body').should('contain', /no toys|empty/i);
        }
      });
      
      // If not own profile, check for contact button
      if (url !== '/profile') {
        cy.get('body').then($body => {
          if ($body.find('button:contains("Contact"), button:contains("Message")').length > 0) {
            cy.get('button:contains("Contact"), button:contains("Message")').should('be.visible');
          }
        });
      }
    });
  });

  it('Tests account settings functionality', () => {
    cy.visit('/profile');
    
    // Find and click settings button
    cy.get('button:contains("Settings"), [aria-label="Settings"]').click({force: true});
    
    // Verify settings page/modal loaded
    cy.get('body').should('contain', /settings|preferences|account/i);
    
    // Test toggle switches if present
    cy.get('body').then($body => {
      const toggles = $body.find('[type="checkbox"], .toggle, .switch');
      if (toggles.length > 0) {
        cy.get('[type="checkbox"], .toggle, .switch').first().click({force: true});
        cy.contains(/saved|updated/i).should('be.visible');
        
        // Toggle back to original state
        cy.get('[type="checkbox"], .toggle, .switch').first().click({force: true});
      }
    });
    
    // Close settings
    cy.get('button:contains("Close"), button:contains("Done"), [aria-label="Close"]').click({force: true});
  });
});