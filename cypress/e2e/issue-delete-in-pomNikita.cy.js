import IssueModal from "../../pages/IssueModal";

describe('Issue delete', () => {
  const issueTitle = 'This is an issue of type: Task.';

  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then(() => {
      // Ensure the issue is visible on the board and open the issue detail modal
      IssueModal.ensureIssueIsVisibleOnBoard(issueTitle);
      cy.contains(issueTitle).click();
    });
  });

  it('Should delete issue successfully', () => {
    // Step 1: Click the delete button to open the confirmation popup
    IssueModal.clickDeleteButton();

    // Step 2: Confirm the deletion in the confirmation pop-up
    IssueModal.confirmDeletion();

    // Add a wait to ensure the modal has time to close
    cy.wait(1000);

    // Step 3: Assert that the issue is no longer visible on the Jira board
    IssueModal.ensureIssueIsNotVisibleOnBoard(issueTitle);
  });

  it('Should cancel deletion process successfully', () => {
    // Step 1: Click the delete button to open the confirmation popup
    IssueModal.clickDeleteButton();

    // Step 2: Cancel the deletion in the confirmation pop-up
    IssueModal.cancelDeletion();

    // Add a wait to ensure the modal has time to close
    cy.wait(1000);

    // Explicitly close the modal if it hasn't closed automatically
    IssueModal.closeDetailModal();

    // Step 3: Assert that the deletion confirmation dialog is not visible
    cy.get(IssueModal.confirmationPopup).should('not.exist');

    // Step 4: Assert that the issue is still visible on the Jira board
    IssueModal.ensureIssueIsVisibleOnBoard(issueTitle);
  });
});