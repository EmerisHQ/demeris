import { Env } from '../support/Env';
import { Assets } from '../support/pages/assets';
import { Portfolio } from '../support/pages/portfolio';
import { WelcomePage } from '../support/pages/welcome-page';

describe('Portfolio visual check', function () {
  beforeEach(() => {
    cy.visit(Env.LOCAL);
    let welcomePage = new WelcomePage();
    welcomePage.tryTheDemoButton().click({ force: true });
  });

  it('visibility of elements', function () {
    let portfolio = new Portfolio();

    portfolio.totalBalanceVisibility();
    portfolio.assetsVisibility();
    portfolio.poolsVisibility();

    let portfolioAssets = new Assets();
    portfolioAssets.aktRow().should('be.visible');
    portfolioAssets.atomRow().should('be.visible');
    portfolioAssets.gravityRow().should('be.visible');

    portfolio.emptyPoolsBehaviour();
  });
  // it('add new pools', function (){
  //   let portfolio = new Portfolio();
  //   portfolio.addNewPools()
  // })
});
