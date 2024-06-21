// cypress.config.js

module.exports = {
  e2e: {
    baseUrl: 'http://localhost:8080', // Ensure this matches your application URL
    supportFile: 'cypress/support/index.js',
    fixturesFolder: 'cypress/fixtures',
    specPattern: 'cypress/e2e/**/*.cy.js', // Update this pattern to match your test file naming convention
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
}