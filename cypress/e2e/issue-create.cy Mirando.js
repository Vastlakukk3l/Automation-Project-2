import { faker } from '@faker-js/faker';

describe('Issue create', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url()
      .should('eq', `${Cypress.env('baseUrl')}project/board`)
      .then((url) => {
        // System will already open issue creating modal in beforeEach block
        cy.visit(url + '/board?modal-issue-create=true');
      });
  });

  function modalclosedReload() {
    // Assert that modal window is closed and successful message is visible
    cy.get('[data-testid="modal:issue-create"]').should('not.exist');
    cy.contains('Issue has been successfully created.').should('be.visible');
    // Reload the page to be able to see recently created issue
    cy.reload();
    // Assert that successful message has dissappeared after the reload
    cy.contains('Issue has been successfully created.').should('not.exist');
  }

  it('Should create an issue and validate it successfully', () => {
    // System finds modal for creating issue and does next steps inside of it
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      // Type value to description input field
      cy.get('.ql-editor').type('TEST_DESCRIPTION');
      cy.get('.ql-editor').should('have.text', 'TEST_DESCRIPTION');
      // Type value to title input field
      // Order of filling in the fields is first description, then title on purpose
      // Otherwise filling title first sometimes doesn't work due to web page implementation
      cy.get('input[name="title"]').type('TEST_TITLE');
      cy.get('input[name="title"]').should('have.value', 'TEST_TITLE');
      // Open issue type dropdown and choose Story
      cy.get('[data-testid="select:type"]').click();
      cy.get('[data-testid="select-option:Story"]')
        .wait(1000)
        .trigger('mouseover')
        .trigger('click');
      cy.get('[data-testid="icon:story"]').should('be.visible');
      // Select Baby Yoda from reporter dropdown
      cy.get('[data-testid="select:reporterId"]').click();
      cy.get('[data-testid="select-option:Baby Yoda"]').click();
      // Select Baby Yoda from assignee dropdown
      cy.get('[data-testid="form-field:userIds"]').click();
      cy.get('[data-testid="select-option:Pickle Rick"]').click();
      // Click on button "Create issue"
      cy.get('button[type="submit"]').click();
    });

    modalclosedReload();

    // Assert than only one list with name Backlog is visible and do steps inside of it
    cy.get('[data-testid="board-list:backlog"]')
      .should('be.visible')
      .and('have.length', '1')
      .within(() => {
        // Assert that this list contains 5 issues and first element with tag p has specified text
        cy.get('[data-testid="list-issue"]')
          .should('have.length', '5')
          .first()
          .find('p')
          .contains('TEST_TITLE')
          .siblings()
          .within(() => {
            //Assert that correct avatar and type icon are visible
            cy.get('[data-testid="avatar:Pickle Rick"]').should('be.visible');
            cy.get('[data-testid="icon:story"]').should('be.visible');
          });
      });
  });

  //Test Case 1: Custom Issue Creation:
  it('Should create another issue (Bug) and validate it successfully', () => {
    // System finds modal for creating issue and does next steps inside of it
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      // Open issue type dropdown and choose Bug
      cy.get('[data-testid="select:type"]').click();
      cy.get('[data-testid="select-option:Bug"]')
        .wait(1000)
        .trigger('mouseover')
        .trigger('click');
      cy.get('[data-testid="icon:bug"]').should('be.visible');
      // Type value to description input field
      cy.get('.ql-editor').type('My bug description');
      cy.get('.ql-editor').should('have.text', 'My bug description');
      // Type value to title input field
      cy.get('input[name="title"]').type('Bug');
      cy.get('input[name="title"]').should('have.value', 'Bug');
      // Select Pickle Rick from reporter dropdown
      cy.get('[data-testid="select:reporterId"]').click();
      cy.get('[data-testid="select-option:Pickle Rick"]').click();
      // Select Lord Gaben from assignee dropdown
      cy.get('[data-testid="form-field:userIds"]').click();
      cy.get('[data-testid="select-option:Lord Gaben"]').click();
      // Set priority: “Highest”
      cy.get('[data-testid="select:priority"]').click();
      cy.get('[data-testid="select-option:Highest"]').click();
      // Click on button "Create issue"
      cy.get('button[type="submit"]').click();
    });

    modalclosedReload();

    // Assert than only one list with name Backlog is visible and do steps inside of it
    cy.get('[data-testid="board-list:backlog"]')
      .should('be.visible')
      .and('have.length', '1')
      .within(() => {
        // Assert that this list contains 5 issues and first element with tag p has specified text
        cy.get('[data-testid="list-issue"]')
          .should('have.length', '5')
          .first()
          .find('p')
          .contains('Bug');
      });
    // Assert that correct avatar and type icon are visible
    cy.get('[data-testid="board-list:backlog"]')
      .contains('Bug')
      .within(() => {
        cy.get('[data-testid="avatar:Lord Gaben"]').should('be.visible');
        cy.get('[data-testid="icon:bug"]').should('be.visible');
      });
  });

  //Test Case 2: Random Data Plugin Issue Creation:
  it('Should create and validate issue (Task) using the random data plugin', () => {
    const randomWord = faker.lorem.word();
    const randomWords = faker.lorem.words(7);
    cy.log(randomWord);
    cy.log(randomWords);

    // System finds modal for creating issue and does next steps inside of it
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      // Open issue type dropdown and clear default type
      cy.get('[data-testid="select:type"]').click();
      cy.get('[data-testid="icon:close"]').click();
      // Choose Task and assert it has been selected
      cy.get('[data-testid="select-option:Task"]').click();
      cy.get('[data-testid="select:type"]').should('contain', 'Task');
      // Type value to description input field
      cy.get('.ql-editor').type(randomWords);
      cy.get('.ql-editor').should('have.text', randomWords);
      // Type value to title input field
      cy.get('input[name="title"]').type(randomWord);
      cy.get('input[name="title"]').should('have.value', randomWord);
      // Select Baby Yoda from reporter dropdown
      cy.get('[data-testid="select:reporterId"]').click();
      cy.get('[data-testid="select-option:Baby Yoda"]').click();
      // Select Baby Yoda from assignee dropdown
      cy.get('[data-testid="form-field:userIds"]').click();
      cy.get('[data-testid="select-option:Baby Yoda"]').click();
      // Set priority: “Low”
      cy.get('[data-testid="select:priority"]').click();
      cy.get('[data-testid="select-option:Low"]').click();
      // Click on button "Create issue"
      cy.get('button[type="submit"]').click();
    });

    modalclosedReload();

    // Assert than only one list with name Backlog is visible and do steps inside of it
    cy.get('[data-testid="board-list:backlog"]')
      .should('be.visible')
      .and('have.length', '1')
      .within(() => {
        // Assert that this list contains 5 issues and first element with tag p has specified text
        cy.get('[data-testid="list-issue"]')
          .should('have.length', '5')
          .first()
          .find('p')
          .contains(randomWord)
          .siblings()
          .within(() => {
            //Assert that correct avatar and type icon are visible
            cy.get('[data-testid="avatar:Baby Yoda"]').should('be.visible');
            cy.get('[data-testid="icon:task"]').should('be.visible');
          });
      });
  });

  it('Should validate title is required field if missing', () => {
    // System finds modal for creating issue and does next steps inside of it
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      // Try to click create issue button without filling any data
      cy.get('button[type="submit"]').click();
      // Assert that correct error message is visible
      cy.get('[data-testid="form-field:title"]').should(
        'contain',
        'This field is required'
      );
    });
  });
});
