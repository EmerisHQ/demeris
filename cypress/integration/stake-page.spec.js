import { Assets } from '../support/pages/assets';
import { Portfolio } from '../support/pages/portfolio';
import { WelcomePage } from '../support/pages/welcome-page';

describe('Stake page', function () {
  if (Cypress.env('VUE_APP_FEATURE_STAKING')) {
    beforeEach(() => {
      cy.visit(Cypress.config().baseUrl);
      let welcomePage = new WelcomePage();
      welcomePage.connectKeplrButton().click();
      welcomePage.betaAgreeButton().click();
    });

    it('visibility of elements', function () {
      let portfolio = new Portfolio();

      portfolio.totalBalanceVisibility();
      portfolio.assetsVisibility();
      portfolio.poolsVisibility();

      let portfolioAssets = new Assets();
      portfolioAssets.atomRow().should('be.visible').click();

      cy.get('[data-testid="stake-table__stake-banner"]').should('exist');
      cy.get('[data-testid=stake-table__stake-button]').click();
    });
  }
});
