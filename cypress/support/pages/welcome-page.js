import { Env } from '../Env';

export class WelcomePage {
  // return cy.get('*[class^="flex flex-col px-8 text-center py-8"]', { timeout: 20000 }).should('be.visible');

  tryTheDemoButtonIsVisible() {
    return this.tryTheDemoButton().should('be.visible');
  }
  tryTheDemoButton() {
    return cy.get('[data-cy="tryTheDemoButton"]'); 
  }

  centerContentWraper() {
    return cy.get('*[class^="flex flex-col px-8 text-center py-8"]');
  }
}
