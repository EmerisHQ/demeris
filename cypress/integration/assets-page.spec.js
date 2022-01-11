import { Assets } from '../support/pages/assets';
import { WelcomePage } from '../support/pages/welcome-page';

describe('Check availability of Assets page elements', function () {
  beforeEach(() => {
    cy.visit(Cypress.config().baseUrl);

    let welcomePage = new WelcomePage();

    welcomePage.connectKeplrButton().click();
    welcomePage.betaAgreeButton().click();
  });

  it('go to Assets page', function () {
    let assets = new Assets();
    assets.goToAssertTab();

    assets.aktRow().should('be.visible');
    assets.atomRow().should('be.visible');

    assets.tableAssetsRow('AKT');
    assets.tableAssetsRow('ATOM');
  });
});
