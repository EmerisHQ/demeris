import { WelcomePage } from '../support/pages/welcome-page';

describe('Welcome page elements location and availibility', function () {
  beforeEach(() => {
    cy.visit(Cypress.config().baseUrl + '/welcome');
  });

  it.only('test', () => {
    cy.visit('http://localhost:8080');
  });

  it('Connect Keplr button ', function () {
    let welcomePage = new WelcomePage();
    welcomePage.connectKeplrButton().should('be.visible');
  });

  it('Try the Demo button ', function () {
    let welcomePage = new WelcomePage();

    welcomePage.tryTheDemoButtonVisibleInstance().should('be.visible');
  });
});
