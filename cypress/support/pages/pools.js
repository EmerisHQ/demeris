export class Pools {
  // ADD LIQUIDITY
  addLiquidityButton() {
    return cy.get('.add-liquidity').contains('Add liquidity');
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
