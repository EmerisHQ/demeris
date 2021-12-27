import { Pools } from '../support/pages/pools';

describe('Pools location and availibility', function () {
  beforeEach(() => {
    cy.visit(Cypress.config().baseUrl);
  });

  it('Pool search field', function () {
    const poolsPage = new Pools();

    poolsPage.goTo();
    poolsPage.searchField().click();
    poolsPage.searchForPool('test');
  });

  it('Add liquidity button usage', function () {
    const poolsPage = new Pools();

    poolsPage.goTo();
    poolsPage.addLiquidityButton().click();
    cy.url().should('contain', 'pools/add');
  });
});
