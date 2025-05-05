describe('Wishes Page Tests', () => {
  beforeEach(() => {
    cy.login('adminsreyas', 'password123');
  });

  it('Successfully loads the wishes page', () => {
    cy.visit('/wishes');
    cy.get('h1, h2').should('contain', /wishes|wish list/i);
    cy.checkPageErrors();
  });

  it('Successfully creates a new wish', () => {
    const wishTitle = `Test Wish ${Date.now()}`;
    
    // Navigate to wishes page
    cy.visit('/wishes');
    
    // Click create wish button
    cy.contains(/create wish|add wish|new wish/i).click();
    
    // Fill out the form
    cy.get('input[name="title"]').type(wishTitle);
    cy.get('textarea[name="description"]').type('This is a test wish created by Cypress');
    
    // If there's an age range field
    cy.get('body').then($body => {
      if ($body.find('input[name="ageRange"]').length > 0) {
        cy.get('input[name="ageRange"]').type('3-8');
      }
    });
    
    // If there's a category dropdown
    cy.get('body').then($body => {
      if ($body.find('select[name="category"]').length > 0) {
        cy.get('select[name="category"]').select('Educational');
      } else if ($body.find('[id*="category"]').length > 0) {
        cy.get('[id*="category"]').click().contains('Educational').click();
      }
    });
    
    // Upload image if there's an upload field
    cy.get('body').then($body => {
      if ($body.find('input[type="file"]').length > 0) {
        cy.get('input[type="file"]').first().attachFile('test-image.txt');
      }
    });
    
    // Submit form
    cy.get('button[type="submit"]').click();
    
    // Verify success
    cy.contains(/success|created|added/i).should('be.visible');
    
    // Verify the wish appears in the wishes list
    cy.visit('/wishes');
    cy.contains(wishTitle).should('be.visible');
  });

  it('Tests viewing wish details', () => {
    // Navigate to wishes page
    cy.visit('/wishes');
    
    // Click on the first wish card
    cy.get('[data-cy="wish-card"], .wish-card, .card').first().click();
    
    // Verify wish details page loaded
    cy.get('h1, h2').should('be.visible');
    cy.get('body').should('contain', /description|details/i);
    
    // Test offer button if present and not own wish
    cy.get('body').then($body => {
      if ($body.find('button:contains("Offer"), button:contains("I have this")').length > 0) {
        cy.get('button:contains("Offer"), button:contains("I have this")').click();
        
        // Type message and submit
        cy.get('textarea').type('I have this toy and would like to offer it to you.');
        cy.get('button:contains("Submit"), button:contains("Send"), button[type="submit"]').click();
        
        // Verify success
        cy.contains(/success|sent|offered/i).should('be.visible');
      }
    });
  });

  it('Tests editing a wish', () => {
    // Navigate to wishes page
    cy.visit('/wishes');
    
    // Find own wishes and click edit
    cy.get('[data-cy="wish-card"], .wish-card, .card').each(($card) => {
      // Check if this card has edit button (meaning it's the user's wish)
      if ($card.find('[data-cy="edit-wish"], button:contains("Edit"), [aria-label="Edit"]').length > 0) {
        cy.wrap($card).find('[data-cy="edit-wish"], button:contains("Edit"), [aria-label="Edit"]').click();
        return false; // Break the loop
      }
    });
    
    // Update wish details
    cy.get('input[name="title"]').clear().type('Updated Wish Title');
    cy.get('textarea[name="description"]').clear().type('Updated wish description from Cypress test');
    
    // Save changes
    cy.get('button[type="submit"], button:contains("Save")').click();
    
    // Verify successful update
    cy.contains(/updated|success|saved/i).should('be.visible');
  });

  it('Tests wish offer management', () => {
    // Navigate to profile or wishes management page
    cy.visit('/profile');
    
    // Go to wishes tab if exists
    cy.get('body').then($body => {
      if ($body.find('button:contains("Wishes"), a:contains("Wishes")').length > 0) {
        cy.get('button:contains("Wishes"), a:contains("Wishes")').click();
      } else {
        cy.visit('/wishes/my-wishes');
      }
    });
    
    // Check if there are any wishes with offers
    cy.get('body').then($body => {
      // If there's a view offers button, test offer management
      if ($body.find('button:contains("View Offers"), button:contains("Offers")').length > 0) {
        cy.get('button:contains("View Offers"), button:contains("Offers")').first().click();
        
        // Test accepting an offer if any exist
        cy.get('body').then($body => {
          if ($body.find('button:contains("Accept"), button:contains("Approve")').length > 0) {
            cy.get('button:contains("Accept"), button:contains("Approve")').first().click();
            cy.get('button:contains("Confirm"), button:contains("Yes")').click();
            cy.contains(/accepted|success/i).should('be.visible');
          }
        });
      }
    });
  });

  it('Tests deleting a wish', () => {
    // Create a test wish specifically for deletion
    const deleteWishTitle = `Delete Wish Test ${Date.now()}`;
    
    // Create a new wish
    cy.visit('/wishes');
    cy.contains(/create wish|add wish|new wish/i).click();
    cy.get('input[name="title"]').type(deleteWishTitle);
    cy.get('textarea[name="description"]').type('This wish will be deleted');
    
    // If there's an age range field
    cy.get('body').then($body => {
      if ($body.find('input[name="ageRange"]').length > 0) {
        cy.get('input[name="ageRange"]').type('3-8');
      }
    });
    
    // Submit form
    cy.get('button[type="submit"]').click();
    
    // Wait for success and go to profile/wishes
    cy.contains(/success|created|added/i).should('be.visible');
    cy.visit('/wishes');
    
    // Find our test wish and delete it
    cy.contains(deleteWishTitle).parent().find('[data-cy="delete-wish"], button:contains("Delete"), [aria-label="Delete"]').click();
    
    // Confirm deletion in modal
    cy.get('button:contains("Delete"), button:contains("Yes"), button:contains("Confirm")').click();
    
    // Verify success message
    cy.contains(/deleted|removed|success/i).should('be.visible');
    
    // Verify wish is no longer in the list
    cy.contains(deleteWishTitle).should('not.exist');
  });
});