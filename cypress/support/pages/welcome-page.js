import { Env } from '../Env';

export class WelcomePage {
  // return cy.get('*[class^="flex flex-col px-8 text-center py-8"]', { timeout: 20000 }).should('be.visible');

  tryTheDemoButtonIsVisible() {
    return this.tryTheDemoButton().should('be.visible');
  }

  tryTheDemoButton() {
    //cy.get('[data-cy="tryTheDemoButton"]', { timeout: 9900000 }).as('guzik')
    //cy.wait('@guzik')
    return cy.get('[data-cy="tryTheDemoButton"]', { timeout: 999912000 });
  }

  centerContentWraper() {
    // cy.waitUntil()
    //*[contains(@class, 'flex flex-col px-8 text-center py-8')]
    // '*[class^="flex flex-col px-8 text-center py-8"]'
    cy.waitFor('*[class^="flex flex-col px-8 text-center py-8"]');
    return cy.get('*[class^="flex flex-col px-8 text-center py-8"]');
  }
}
