export class WelcomePage {
  // return cy.get('*[class^="flex flex-col px-8 text-center py-8"]', { timeout: 20000 }).should('be.visible');

  goToWelcomePage() {
    cy.visit('/welcome');
  }

  connectKeplrButton() {
    return cy.contains('Connect Keplr');
  }

  // TODO - add logic to count cought elements (in case it will be more/less in the future)
  tryTheDemoButtonVisibleInstance() {
    if (cy.get('[data-cy=tryTheDemoButton]').should('be.visible')) {
      return cy.get('[data-cy=tryTheDemoButton]');
    } else if (cy.get('[data-cy=tryTheDemoButton2]').should('be.visible')) {
      return cy.get('[data-cy=tryTheDemoButton2]');
    } else {
      cy.log('none of tryTheDemoButton is visible');
    }
  }

  tryTheDemoButtonIsVisible() {
    return this.tryTheDemoButton().should('be.visible');
  }

  tryTheDemoButtonForceClick() {
    this.tryTheDemoButton().click({ force: true });
  }

  tryTheDemoButton() {
    return cy.get('[data-cy="tryTheDemoButton"]');
  }

  centerContentWraper() {
    return cy.get('*[class^="flex flex-col px-8 text-center py-8"]');
  }
}
