import { Receive } from '../support/pages/receive';
import { WelcomePage } from '../support/pages/welcome-page';

describe('Navbar elements location and availibility', function () {
  beforeEach(() => {
    cy.visit(Cypress.config().baseUrl);
    let welcomePage = new WelcomePage();

    welcomePage.connectKeplrButton().click();
    welcomePage.betaAgreeButton().click();
  });

  it.skip('Portfolio, Assets, Pools, Logo - Navbar elements', function () {
    let receivePage = new Receive();
    receivePage.goTo();

    receivePage.fillInSearchField('ATOM');
    receivePage.teble().should('contain', 'ATOM');
    receivePage.teble().should('contain', 'Cosmos Hub Emeris');

    receivePage.searchField().clear();
    receivePage.fillInSearchField('test');
    receivePage.teble().should('be.empty');

    receivePage.quitWithX();
    cy.url().should('eq', Cypress.config().baseUrl);
  });
});
