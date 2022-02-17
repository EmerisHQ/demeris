export class Navbar {
  goToDashboard() {
    // wait for navbar logo to be visible
    cy.get(this.navbarLogo(), { timeout: 20000 }).should('be.visible');

    this.navbarLogo().click();

    cy.url().should('eq', Cypress.config().baseUrl);
  }

  openDemoFromWelcomeSite() {
    if (cy.url().contains('/welcome')) {
      cy.contains('Try the demo').click();
    }
  }

  //Navbar logo visibility
  navbarLogoIsVisible() {
    return this.navbarLogo().should('be.visible');
  }

  // TABS
  navbarLogo() {
    return this.navbar().get('[data-cy=navbar-logo]');
  }

  portfolioTab() {
    return this.navbar().contains('Portfolio');
  }

  assetsTab() {
    return this.navbar().contains('Assets');
  }

  poolsTab() {
    return this.navbar().contains('Pools');
  }

  receive() {
    return cy.get('a[href="/receive"]');
  }

  send() {
    return cy.get('a[href="/send"]');
  }

  userSettings() {
    return this.navbar().get("[class *= 'settings-wrapper']");
  }

  navbar() {
    return cy.get("[role = 'navigation']");
  }
}
