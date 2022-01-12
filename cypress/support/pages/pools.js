import { Navbar } from './navbar';

export class Pools {
  goTo() {
    const navbar = new Navbar();
    navbar.poolsTab().click();
  }

  // ADD LIQUIDITY
  addLiquidityButton() {
    return cy.get('span').contains('Add liquidity');
  }

  addLiquidityClick() {
    addLiquidityButton().click();
    cy.url().should('contain', 'pools/add');
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
