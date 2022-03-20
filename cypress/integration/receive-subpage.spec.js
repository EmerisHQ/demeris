import { goToWithKeplr } from '../support/pages/goto';
import { Receive } from '../support/pages/receive';

describe('Navbar elements location and availibility', function () {
  beforeEach(() => {
    goToWithKeplr('/receive');
  });

  it('Portfolio, Assets, Pools, Logo - Navbar elements', function () {
    let receivePage = new Receive();

    receivePage.fillInSearchField('ATOM');
    receivePage.teble().should('contain', 'ATOM');
    receivePage.teble().should('contain', 'Cosmos Hub');

    receivePage.searchField().clear();
    receivePage.fillInSearchField('test');
    receivePage.teble().should('be.empty');

    receivePage.quitWithX();
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });
});
