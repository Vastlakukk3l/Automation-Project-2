describe('Issue deletion', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project`).then((url) => {
      cy.visit(url + '/board');
      
      // Open the first issue on the board
      cy.get('[data-testid="board-list:backlog"]')
        .find('[data-testid="list-issue"]')
        .first()
        .click();

      // Assert the visibility of the issue detail view modal
      cy.get('[data-testid="modal:issue-details"]').should('be.visible');
    });
  });

  it('Should delete an issue successfully', () => {
    // Delete the issue by clicking the delete button and confirming the deletion
    cy.get('[data-testid="icon:trash"]').click();
    cy.get('[data-testid="modal:confirm"]').should('be.visible');
    cy.get('[data-testid="modal:confirm"]').contains('button', 'Delete issue').click();

    // Assert that the deletion confirmation dialogue is not visible
    cy.get('[data-testid="modal:confirm"]').should('not.exist');

    // Assert that the issue detail modal is closed
    cy.get('[data-testid="modal:issue-details"]').should('not.exist');

    // Assert that the issue is deleted and no longer displayed on the Jira board
    cy.get('[data-testid="board-list:backlog"]').within(() => {
      cy.get('[data-testid="list-issue"]').should('not.contain', 'This is an issue of type: Task.');
    });
  });

  it('Should cancel the deletion and ensure the issue is not deleted', () => {
    // Click the delete button to initiate the deletion process
    cy.get('[data-testid="icon:trash"]').click();
    
    // Assert that the deletion confirmation dialog is visible
    cy.get('[data-testid="modal:confirm"]').should('be.visible');
    
    // Cancel the deletion by clicking the cancel button
    cy.get('[data-testid="modal:confirm"]').contains('button', 'Cancel').click();
    
    // Assert that the deletion confirmation dialogue is not visible
    cy.get('[data-testid="modal:confirm"]').should('not.exist');

    // Assert that the issue detail modal is still visible
    cy.get('[data-testid="modal:issue-details"]').should('be.visible');

    // Assert that the issue is still displayed on the Jira board
    cy.get('[data-testid="board-list:backlog"]').within(() => {
      cy.get('[data-testid="list-issue"]').should('contain', 'This is an issue of type: Task.');
    });
  });
});