describe("Delete issue", () => {
    beforeEach(() => {
      
      cy.visit("/");
      cy.url().should("eq", `${Cypress.env("baseUrl")}project/board`).then((url) => {
        cy.visit(url + "/board");
        cy.get('[data-testid="list-issue"]').first().click();
      });
  
      
      cy.get('[data-testid="modal:issue-details"]').should("be.visible");
    });
  
    // Delete issue
    it("Test should delete the issue and verify that it is no longer present", () => {
      
      cy.get('[data-testid="icon:trash"]').click();
  
      cy.get('[data-testid="modal:confirm"]').contains("Delete issue").click();
      
      cy.get('[data-testid="modal:confirm"]').should("not.exist");
  
      cy.get('[data-testid="board-list:backlog"]').should("not.contain", "Bug");
    });
  
// Cancel delete issue
it("Should cancel issue deletion and verify the issue is still on the board", () => {
    
    cy.get('[data-testid="modal:issue-details"]').should("be.visible");
  
    cy.get('[data-testid="icon:trash"]').click();
  
    cy.get('[data-testid="modal:confirm"]').contains("Cancel").click();
  
    cy.get('[data-testid="modal:confirm"]').should("not.exist");
  
    cy.reload();
  
    cy.get('[data-testid="board-list:backlog"]').should("be.visible");
  
    cy.get('[data-testid="board-list:backlog"]').should("contain.text", "Task");
  });
});