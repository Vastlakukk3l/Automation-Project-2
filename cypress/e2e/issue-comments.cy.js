describe("Issue comments: creating, editing, and deleting", () => {
    const comment = "Hey i'm mr. mee6 look at me!";
    
    beforeEach(() => {
      cy.visit("/");
      cy.url().should("eq", `${Cypress.env("baseUrl")}project/board`)
        .then((url) => {
        cy.visit(url + "/board");
        cy.contains("This is an issue of type: Task.")
          .click();
      });
    });
  
    const getIssueDetailsModal = () => cy.get('[data-testid="modal:issue-details"]');
  
    it("Creates a comment successfully", () => {
      getIssueDetailsModal()
      .within(() => {
        cy.contains("Add a comment...")
          .click();
        cy.wait(10000);
        cy.get('textarea[placeholder="Add a comment..."]')
          .type(comment);
        cy.contains("button", "Save")
          .click()
          .should("not.exist");
        cy.get('[data-testid="issue-comment"]')
          .should("contain", comment);
      });
    });
  
    it("Edits a comment successfully", () => {
      getIssueDetailsModal()
      .within(() => {
        cy.get('[data-testid="issue-comment"]')
          .first()
          .contains("Edit")
          .click()
          .should("not.exist");
        cy.get('textarea[placeholder="Add a comment..."]')
          .clear()
          .type(comment);
        cy.contains("button", "Save")
          .click()
          .should("not.exist");
        cy.get('[data-testid="issue-comment"]')
          .should("contain", comment);
      });
    });
  
    it("Deletes a comment successfully", () => {
      getIssueDetailsModal()
        .find('[data-testid="issue-comment"]')
        .contains("Delete")
        .click();
      cy.get('[data-testid="modal:confirm"]')
        .wait(5000)
        .contains("button", "Delete comment")
        .click()
        .should("not.exist");
      getIssueDetailsModal()
        .find("[data-testid=issue-comment]")
        .should("not.exist");
    });
  });
  