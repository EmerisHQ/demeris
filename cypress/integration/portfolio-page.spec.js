import { Assets } from '../support/pages/assets';
import { goToWithKeplr } from '../support/pages/goto';
import { Portfolio } from '../support/pages/portfolio';

describe('Portfolio visual check', function () {
  beforeEach(() => {
    goToWithKeplr('/');
  });

  it('visibility of elements', function () {
    let portfolio = new Portfolio();

    portfolio.totalBalanceVisibility();
    portfolio.assetsVisibility();
    portfolio.poolsVisibility();

    let portfolioAssets = new Assets();
    portfolioAssets.atomRow().should('be.visible');

    portfolio.emptyPoolsBehaviour();
  });
});
