export class Portfolio {
  totalBalanceVisibility() {
    cy.contains('Total balance').should('be.visible');
    cy.get('*[class="total-price"]').should('contain', '$');
  }

  assetsVisibility() {
    cy.get('h2').contains('Assets').should('be.visible');
  }
  poolsVisibility() {
    cy.get('h2').contains('Pools').should('be.visible');
  }

  emptyPoolsBehaviour() {
    cy.contains('Pools you add liquidity to will appear here.').should('be.visible');
    cy.get('button:contains("Explore pools")').should('be.visible').click();
    cy.url().should('eq', 'http://localhost:8080/pools');
  }
}
