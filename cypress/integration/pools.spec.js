import { goToWithKeplr } from '../support/pages/goto';
import { Pools } from '../support/pages/pools';

describe('Pools location and availibility', function () {
  beforeEach(() => {
    goToWithKeplr('/pools');
  });

  it('Pool search field', function () {
    const poolsPage = new Pools();
    poolsPage.searchField().click();
    poolsPage.searchForPool('test');
  });

  it('Add liquidity button usage', function () {
    const poolsPage = new Pools();
    poolsPage.addLiquidityButton().click();
    cy.url().should('contain', 'pools/add');
  });
});
