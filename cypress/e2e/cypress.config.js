const { defineConfig } = require("cypress");

module.exports = {
  e2e: {
    // Adjust the pattern to match your spec files
    specPattern: "*.cy.{js,jsx,ts,tsx}",
    baseUrl: 'https://jira.ivorreic.com/project/board',
    env: {
      baseUrl: 'https://jira.ivorreic.com/',
    },
    defaultCommandTimeout: 90000,
    requestTimeout: 40000,
  },
};