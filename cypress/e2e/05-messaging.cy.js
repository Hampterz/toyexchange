describe('Messaging Tests', () => {
  beforeEach(() => {
    cy.login('adminsreyas', 'password123');
  });

  it('Successfully loads the messages page', () => {
    cy.visit('/messages');
    cy.get('h1, h2').should('contain', /messages|conversations|inbox/i);
    cy.checkPageErrors();
  });

  it('Shows message threads if they exist', () => {
    cy.visit('/messages');
    
    // Check if there are message threads
    cy.get('body').then($body => {
      const hasThreads = $body.find('[data-cy="message-thread"], .message-thread, .conversation').length > 0;
      if (hasThreads) {
        cy.get('[data-cy="message-thread"], .message-thread, .conversation').should('be.visible');
      } else {
        cy.get('body').should('contain', /no messages|empty|start a conversation/i);
      }
    });
  });

  it('Tests sending a message in an existing conversation', () => {
    cy.visit('/messages');
    
    // Check if there are any message threads
    cy.get('body').then($body => {
      if ($body.find('[data-cy="message-thread"], .message-thread, .conversation').length > 0) {
        // Click on the first thread
        cy.get('[data-cy="message-thread"], .message-thread, .conversation').first().click();
        
        // Type and send a new message
        cy.get('textarea, input[type="text"]').type('This is a test message from Cypress');
        cy.get('button:contains("Send"), button[type="submit"]').click();
        
        // Verify the message appears in the conversation
        cy.contains('This is a test message from Cypress').should('be.visible');
      } else {
        // Skip test if no conversations exist
        cy.log('No existing conversations found to test');
      }
    });
  });

  it('Tests message thread info/details', () => {
    cy.visit('/messages');
    
    // Check if there are any message threads
    cy.get('body').then($body => {
      if ($body.find('[data-cy="message-thread"], .message-thread, .conversation').length > 0) {
        // Click on the first thread
        cy.get('[data-cy="message-thread"], .message-thread, .conversation').first().click();
        
        // Check for details/info button
        cy.get('body').then($body => {
          if ($body.find('[data-cy="conversation-info"], button:contains("Info"), [aria-label="Conversation info"]').length > 0) {
            cy.get('[data-cy="conversation-info"], button:contains("Info"), [aria-label="Conversation info"]').click();
            
            // Verify the info panel opens
            cy.get('[data-cy="conversation-details"], .conversation-details, .drawer').should('be.visible');
            
            // Close the info panel
            cy.get('button:contains("Close"), [aria-label="Close"]').click();
          }
        });
      } else {
        // Skip test if no conversations exist
        cy.log('No existing conversations found to test thread info');
      }
    });
  });

  it('Tests message deletion', () => {
    cy.visit('/messages');
    
    // Check if there are any message threads
    cy.get('body').then($body => {
      if ($body.find('[data-cy="message-thread"], .message-thread, .conversation').length > 0) {
        // Click on the first thread
        cy.get('[data-cy="message-thread"], .message-thread, .conversation').first().click();
        
        // Send a test message to delete
        cy.get('textarea, input[type="text"]').type('This message will be deleted');
        cy.get('button:contains("Send"), button[type="submit"]').click();
        
        // Wait for message to appear
        cy.contains('This message will be deleted').should('be.visible');
        
        // Find and click delete button on the message
        cy.contains('This message will be deleted').parent().find('[data-cy="delete-message"], button:contains("Delete"), [aria-label="Delete"]').click({force: true});
        
        // Confirm deletion if needed
        cy.get('body').then($body => {
          if ($body.find('button:contains("Confirm"), button:contains("Yes")').length > 0) {
            cy.get('button:contains("Confirm"), button:contains("Yes")').click();
          }
        });
        
        // Verify message is deleted
        cy.contains('This message will be deleted').should('not.exist');
      } else {
        // Skip test if no conversations exist
        cy.log('No existing conversations found to test message deletion');
      }
    });
  });

  it('Tests deleting an entire conversation', () => {
    // Only run this test if we have spare conversations to delete
    // Create a test conversation if needed
    cy.visit('/');
    
    // Find a toy to contact about
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
    cy.get('textarea, input[type="text"]').type('This is a test conversation that will be deleted');
    
    // Send the message
    cy.get('button:contains("Send"), button[type="submit"]').click();
    
    // Go to messages page
    cy.visit('/messages');
    
    // Find the conversation that we just created
    cy.contains('This is a test conversation that will be deleted').parent().parent().find('[data-cy="delete-conversation"], button:contains("Delete"), [aria-label="Delete conversation"]').click({force: true});
    
    // Confirm deletion
    cy.get('button:contains("Delete"), button:contains("Confirm"), button:contains("Yes")').click();
    
    // Verify conversation is deleted
    cy.contains('This is a test conversation that will be deleted').should('not.exist');
  });

  it('Tests blocking a user in messages', () => {
    cy.visit('/messages');
    
    // Check if there are any message threads
    cy.get('body').then($body => {
      if ($body.find('[data-cy="message-thread"], .message-thread, .conversation').length > 0) {
        // Click on the first thread
        cy.get('[data-cy="message-thread"], .message-thread, .conversation').first().click();
        
        // Find block user option
        cy.get('body').then($body => {
          const hasBlockButton = $body.find('button:contains("Block"), [aria-label="Block user"]').length > 0;
          
          if (hasBlockButton) {
            // Click block button
            cy.get('button:contains("Block"), [aria-label="Block user"]').click();
            
            // Confirm block
            cy.get('button:contains("Confirm"), button:contains("Yes")').click();
            
            // Verify success message
            cy.contains(/blocked|user blocked/i).should('be.visible');
            
            // Unblock user to clean up
            cy.visit('/profile');
            cy.contains(/settings|privacy/i).click({force: true});
            cy.contains(/blocked users|blocks/i).click({force: true});
            cy.get('button:contains("Unblock")').first().click();
            cy.contains(/unblocked|removed/i).should('be.visible');
          } else {
            cy.log('Block functionality not found in conversation');
          }
        });
      } else {
        // Skip test if no conversations exist
        cy.log('No existing conversations found to test blocking');
      }
    });
  });
});