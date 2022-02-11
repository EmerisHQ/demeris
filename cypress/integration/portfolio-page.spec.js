import { Assets } from '../support/pages/assets';
import { Portfolio } from '../support/pages/portfolio';
import { WelcomePage } from '../support/pages/welcome-page';

describe('Portfolio visual check', function () {
  beforeEach(() => {
    cy.visit(Cypress.config().baseUrl);
    let welcomePage = new WelcomePage();
    welcomePage.connectKeplrButton().click();
    welcomePage.betaAgreeButton().click();
  });

  it.skip('visibility of elements', function () {
    let portfolio = new Portfolio();

    portfolio.totalBalanceVisibility();
    portfolio.assetsVisibility();
    portfolio.poolsVisibility();

    let portfolioAssets = new Assets();
    portfolioAssets.atomRow().should('be.visible');

    portfolio.emptyPoolsBehaviour();
  });
});
