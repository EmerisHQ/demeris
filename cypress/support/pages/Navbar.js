// export default class Navbar{}
import 'cypress-wait-until';
import 'cypress-wait-until';

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

  navbar() {
    cy.get("[role = 'navigation']", { timeout: 20000 }).should('be.visible');
    return cy.get("[role = 'navigation']");
  }

  navbarLogo() {
    return this.navbar().get('//*svg[xmlns="http://www.w3.org/2000/svg"]');
    return cy.get('[data-cy=logo]');
  }
}
