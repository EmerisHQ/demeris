import { WelcomePage } from '../support/pages/welcome-page';

describe('Check availability of Assets page elements', function () {
  beforeEach(() => {
    cy.visit(Cypress.config().baseUrl);
  });
  it('connect Keplr', function () {
    // go to demo from /welcome page
    let welcomePage = new WelcomePage();

    welcomePage.connectKeplrButton().click();
    welcomePage.betaAgreeButton().click();
  });
});
