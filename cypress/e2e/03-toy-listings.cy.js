describe('Toy Listings Tests', () => {
  beforeEach(() => {
    cy.login('adminsreyas', 'password123');
  });

  it('Successfully creates a new toy listing', () => {
    const toyTitle = `Test Toy ${Date.now()}`;
    
    // Navigate to add toy page
    cy.visit('/');
    cy.contains(/post toy|add toy|new toy/i).click();
    
    // Fill out the form
    cy.get('input[name="title"]').type(toyTitle);
    cy.get('textarea[name="description"]').type('This is a test toy created by Cypress');
    cy.get('input[name="ageRange"]').type('3-8');
    cy.get('input[name="condition"]').type('Good');
    
    // If there's a category dropdown
    cy.get('body').then($body => {
      if ($body.find('select[name="category"]').length > 0) {
        cy.get('select[name="category"]').select('Educational');
      } else if ($body.find('[id*="category"]').length > 0) {
        cy.get('[id*="category"]').click().contains('Educational').click();
      }
    });
    
    // If there's a location field
    cy.get('body').then($body => {
      if ($body.find('input[name="location"]').length > 0) {
        cy.get('input[name="location"]').type('Test Location');
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
    
    // Verify the toy appears in user listings
    cy.visit('/profile');
    cy.contains(toyTitle).should('be.visible');
  });

  it('Tests viewing toy details', () => {
    // Navigate to home page to see toy listings
    cy.visit('/');
    
    // Click on the first toy card
    cy.get('[data-cy="toy-card"], .toy-card, .card').first().click();
    
    // Verify toy details page loaded
    cy.get('h1, h2').should('be.visible');
    cy.get('body').should('contain', /description|details|condition/i);
    
    // Test image gallery if present
    cy.get('body').then($body => {
      if ($body.find('[data-cy="image-gallery"] button, .gallery button').length > 0) {
        cy.get('[data-cy="image-gallery"] button, .gallery button').first().click();
        cy.get('body').find('[aria-label="Close"], button:contains("Close")').click();
      }
    });
  });

  it('Tests editing a toy listing', () => {
    // Navigate to profile/my toys
    cy.visit('/profile');
    
    // Click on edit button of first toy
    cy.get('[data-cy="edit-toy"], button:contains("Edit"), [aria-label="Edit"]').first().click();
    
    // Update toy details
    cy.get('input[name="title"]').clear().type('Updated Toy Title');
    cy.get('textarea[name="description"]').clear().type('Updated toy description from Cypress test');
    
    // Save changes
    cy.get('button[type="submit"], button:contains("Save")').click();
    
    // Verify successful update
    cy.contains(/updated|success|saved/i).should('be.visible');
  });

  it('Tests marking a toy as traded', () => {
    // Navigate to profile/my toys
    cy.visit('/profile');
    
    // Find and click on Mark as Traded button
    cy.get('body').then($body => {
      if ($body.find('[data-cy="mark-as-traded"], button:contains("Mark as Traded")').length > 0) {
        cy.get('[data-cy="mark-as-traded"], button:contains("Mark as Traded")').first().click();
        
        // Confirm the action in modal dialog
        cy.get('button:contains("Confirm Trade"), button:contains("Yes")').click();
        
        // Verify success message
        cy.contains(/traded|success/i).should('be.visible');
        
        // Verify toy appears in Traded tab
        cy.contains(/traded|completed/i).click();
        cy.get('div').should('contain', 'Updated Toy Title');
      }
    });
  });

  it('Tests reactivating an inactive toy', () => {
    // Navigate to profile page
    cy.visit('/profile');
    
    // Go to Inactive tab
    cy.contains(/inactive/i).click();
    
    // Check if there are any inactive toys
    cy.get('body').then($body => {
      if (!$body.text().includes('no inactive toy')) {
        // Find and click on Reactivate button
        cy.get('[data-cy="reactivate-toy"], button:contains("Reactivate")').first().click();
        
        // Confirm the action in modal dialog if present
        cy.get('body').then($body => {
          if ($body.find('button:contains("Reactivate"), button:contains("Confirm")').length > 0) {
            cy.get('button:contains("Reactivate"), button:contains("Confirm")').click();
          }
        });
        
        // Verify success message
        cy.contains(/reactivated|success/i).should('be.visible');
      }
    });
  });

  it('Tests deleting a toy listing', () => {
    // Create a test toy specifically for deletion
    const deleteToyTitle = `Delete Test ${Date.now()}`;
    
    // Create a new toy
    cy.visit('/');
    cy.contains(/post toy|add toy|new toy/i).click();
    cy.get('input[name="title"]').type(deleteToyTitle);
    cy.get('textarea[name="description"]').type('This toy will be deleted');
    cy.get('input[name="ageRange"]').type('3-8');
    cy.get('input[name="condition"]').type('Good');
    
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
    
    // Wait for success and go to profile
    cy.contains(/success|created|added/i).should('be.visible');
    cy.visit('/profile');
    
    // Find our test toy and delete it
    cy.contains(deleteToyTitle).parent().find('[data-cy="delete-toy"], button:contains("Delete"), [aria-label="Delete"]').click();
    
    // Confirm deletion in modal
    cy.get('button:contains("Delete"), button:contains("Yes"), button:contains("Confirm")').click();
    
    // Verify success message
    cy.contains(/deleted|removed|success/i).should('be.visible');
    
    // Verify toy is no longer in the list
    cy.contains(deleteToyTitle).should('not.exist');
  });

  it('Tests the favorites functionality', () => {
    // Go to home page to see toys
    cy.visit('/');
    
    // Find a toy and add to favorites
    cy.get('[data-cy="toy-card"], .toy-card, .card').first().find('[data-cy="favorite-button"], button:contains("Favorite"), [aria-label="Add to favorites"]').click();
    
    // Verify added to favorites notification
    cy.contains(/added to favorites|favorited/i).should('be.visible');
    
    // Navigate to favorites page
    cy.contains(/favorites|saved/i).click();
    
    // Verify the toy appears in favorites
    cy.get('[data-cy="toy-card"], .toy-card, .card').should('have.length.at.least', 1);
    
    // Remove from favorites
    cy.get('[data-cy="toy-card"], .toy-card, .card').first().find('[data-cy="unfavorite-button"], button:contains("Unfavorite"), [aria-label="Remove from favorites"]').click();
    
    // Verify removal notification
    cy.contains(/removed from favorites|unfavorited/i).should('be.visible');
  });

  it('Tests contact/messaging functionality', () => {
    // Go to home page to see toys
    cy.visit('/');
    
    // Click on a toy that doesn't belong to the current user
    cy.get('[data-cy="toy-card"], .toy-card, .card').each(($card) => {
      // Find cards that have a contact/message button
      if ($card.find('[data-cy="contact-button"], button:contains("Contact"), button:contains("Message")').length > 0) {
        cy.wrap($card).click();
        return false; // Break the loop
      }
    });
    
    // Click contact/message button on the toy details page
    cy.get('[data-cy="contact-button"], button:contains("Contact"), button:contains("Message")').click();
    
    // Type a message
    cy.get('textarea, input[type="text"]').type('This is a test message from Cypress');
    
    // Send the message
    cy.get('button:contains("Send"), button[type="submit"]').click();
    
    // Verify success message
    cy.contains(/sent|success/i).should('be.visible');
    
    // Navigate to messages page to see the conversation
    cy.visit('/messages');
    
    // Verify the message thread exists
    cy.get('[data-cy="message-thread"], .message-thread, .conversation').should('have.length.at.least', 1);
  });
});