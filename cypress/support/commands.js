// import 'cypress-xpath';

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
// cypress/support/command.js
// import addExtensionCommands from 'cypress-browser-extension-plugin/commands';

import { Env } from './Env';
// addExtensionCommands(Cypress);

const tryTheDemoButtonXpath = '//*[contains(text(),"Try the demo")]';

Cypress.Commands.add('launchDemo', () => {
  cy.visit(Env.LOCAL);
  // cy.wait(cy.xpath('//*[contains(text(),"Try the demo")]', {timeout: 20000}).should('be.visible'))
  cy.wait(12000);
  cy.xpath('//*[contains(text(),"Try the demo")]').should('be.visible');
  cy.xpath('//*[contains(text(),"Try the demo")]').click();
});
