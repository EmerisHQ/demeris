// export default class Navbar{}

import { Env } from '../Env';

export class Navbar {
  // constructor(){
  //     this.path = "[role = 'navigation']"
  // }

  goToDashboard() {
    // timeout for page to be loaded
    cy.wait(13000);
    cy.waitFor("[role = 'navigation']");

    this.navbar().children('svg').click();

    cy.url().should('eq', Env.LOCAL);
  }

  navbar() {
    return cy.get("[role = 'navigation']");
  }
}
