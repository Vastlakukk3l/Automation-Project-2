import IssueModal from '../../pages/IssueModal';

describe('Issue delete', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url()
      .should('eq', `${Cypress.env('baseUrl')}project/board`)
      .then((url) => {
        cy.contains(issueTitle).click();
      });
  });

  const issueTitle = 'This is an issue of type: Task.';
  const EXPECTED_AMOUNT_OF_ISSUES_DELETION = '3';
  const EXPECTED_AMOUNT_OF_ISSUES_CANCELLATION = '4';

  it('Should delete issue successfully', () => {
    IssueModal.clickDeleteButton();
    IssueModal.confirmDeletion();
    IssueModal.ensureIssueIsNotVisibleOnBoard(issueTitle);
    IssueModal.checkBacklogAmountOfIssues(EXPECTED_AMOUNT_OF_ISSUES_DELETION);
  });

  it('Should cancel deletion process successfully', () => {
    IssueModal.clickDeleteButton();
    IssueModal.cancelDeletion();
    IssueModal.closeDetailModal();
    IssueModal.ensureIssueIsVisibleOnBoard(issueTitle);
    IssueModal.checkBacklogAmountOfIssues(
      EXPECTED_AMOUNT_OF_ISSUES_CANCELLATION
    );
  });
});
