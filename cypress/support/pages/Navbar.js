import { Env } from '../Env';

export class Navbar {
  // constructor(){
  //     this.path = "[role = 'navigation']"
  // }

  goToDashboard() {
    // wait for navbar logo to be visible
    cy.get(this.navbarLogo(), { timeout: 20000 }).should('be.visible');

    this.navbarLogo().click();

    cy.url().should('eq', Env.LOCAL);
  }

  openDemoFromWelcomeSite() {
    if (cy.url().contains('/welcome')) {
      cy.contains('Try the demo').click();
    }
  }

  portfolioTab() {
    return this.navbar().contains('Portfolio');
  }

  navbarLogo() {
    return this.navbar().get('[data-cy=logo]');
  }

  navbar() {
    cy.get("[role = 'navigation']", { timeout: 20000 }).should('be.visible');
    return cy.get("[role = 'navigation']");
  }
}
