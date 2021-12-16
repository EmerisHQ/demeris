export class WelcomePage {
  // return cy.get('*[class^="flex flex-col px-8 text-center py-8"]', { timeout: 20000 }).should('be.visible');

  goToWelcomePage() {
    cy.visit('/welcome');
  }

  connectKeplrButton() {
    return cy.contains('Connect Keplr');
  }

  tryTheDemoButtonIsVisible() {
    const buttons = cy.get('a[class*="mt-4 font-medium hover:text-text p-1.5 transition-colors active:opacity-70"]');
    if (buttons[0].should('be.visible') || buttons[1].should('be.visible')) {
      return true;
    } else {
      return false;
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
