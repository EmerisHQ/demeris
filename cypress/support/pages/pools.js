import { Env } from '../Env';
import { Navbar } from './Navbar';

export class Pools {
  goTo() {
    const navbar = new Navbar();
    navbar.poolsTab().click();
  }

  // SEARCH FIELD
  searchField() {
    return cy.get('input[placeholder="Search assets and pools"]');
  }

  searchForPool(poolToSearchFor) {
    this.searchField().click();
    this.searchField().type(poolToSearchFor);
    this.searchField().should('have.value', poolToSearchFor);
  }
}
