import { Pools } from '../support/pages/pools';
import { WelcomePage } from '../support/pages/welcome-page';

describe('Pools location and availibility', function () {
  beforeEach(() => {
    cy.visit(Cypress.config().baseUrl);

    let welcomePage = new WelcomePage();
    welcomePage.connectKeplrButton().click();
    welcomePage.betaAgreeButton().click();
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
