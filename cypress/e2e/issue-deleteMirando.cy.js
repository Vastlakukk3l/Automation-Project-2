describe('Issue deletion and deletion cancellation', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url()
      .should('eq', `${Cypress.env('baseUrl')}project`)
      .then((url) => {
        cy.visit(url + '/board');
        cy.contains('This is an issue of type: Task.').click();
        getIssueDetailsModal().should('be.visible');
      });
  });

  const getIssueDetailsModal = () =>
    cy.get('[data-testid="modal:issue-details"]');
  const getDeletionConfirmationModal = () =>
    cy.get('[data-testid="modal:confirm"]');

  //Test Case 1: Issue deletion:
  it('Should delete first issue from the board and validate it successfully', () => {
    getIssueDetailsModal().within(() => {
      cy.get('[data-testid="icon:trash"]')
        .should('be.visible')
        .trigger('mouseover')
        .trigger('click');
    });
    getDeletionConfirmationModal()
      .should('be.visible')
      .within(() => {
        cy.contains('Are you sure you want to delete this issue?');
        cy.get('button').contains('Delete issue').click();
      });

    getDeletionConfirmationModal().should('not.exist');
    getIssueDetailsModal().should('not.exist');

    cy.get('[data-testid="board-list:backlog"]')
      .should('be.visible')
      .and('have.length', '1')
      .within(() => {
        cy.get('[data-testid="list-issue"]')
          .should('have.length', '3')
          .first()
          .should('not.have.text', 'This is an issue of type: Task.');
      });
  });

  //Test Case 2: Issue deletion cancellation:
  it('Should cancel deletion of the first issue from the board and validate it successfully', () => {
    getIssueDetailsModal().within(() => {
      cy.get('[data-testid="icon:trash"]')
        .should('be.visible')
        .trigger('mouseover')
        .trigger('click');
    });
    getDeletionConfirmationModal()
      .should('be.visible')
      .and('contain', 'Are you sure you want to delete this issue?');
    cy.get('button').contains('Cancel').click();

    getDeletionConfirmationModal().should('not.exist');
    getIssueDetailsModal()
      .should('exist')
      .within(() => {
        cy.get('[data-testid="icon:close"]')
          .first()
          .should('be.visible')
          .click();
      });

    getIssueDetailsModal().should('not.exist');

    cy.get('[data-testid="board-list:backlog"]')
      .should('be.visible')
      .and('have.length', '1')
      .within(() => {
        cy.get('[data-testid="list-issue"]')
          .should('have.length', '4')
          .first()
          .should('have.text', 'This is an issue of type: Task.');
      });
  });
});
