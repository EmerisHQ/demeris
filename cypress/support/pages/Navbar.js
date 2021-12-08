import { Env } from '../Env';

export class Navbar {
  // constructor(){
  //     this.path = "[role = 'navigation']"
  // }

  //NOTE: {TODO}
  // all pages classes can have method navigating to itself like:
  // goToTHISPage(){
  //navbar.thisTab().click}

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

  // TABS
  portfolioTab() {
    return this.navbar().contains('Portfolio');
  }

  assetsTab() {
    return this.navbar().contains('Assets');
  }

  poolsTab() {
    return this.navbar().contains('Pools');
  }

  navbarLogo() {
    return this.navbar().get('[data-cy=navbar-logo]');
  }

  navbar() {
    cy.get("[role = 'navigation']", { timeout: 20000 }).should('be.visible');
    return cy.get("[role = 'navigation']");
  }
}
