import { Assets } from '../support/pages/assets';
import { WelcomePage } from '../support/pages/welcome-page';
// import {actions} from '../../src/store/demeris/actions'

describe('Check availability of Assets page elements', function () {
  beforeEach(() => {
    cy.visit(Cypress.config().baseUrl);

    let welcomePage = new WelcomePage();

    welcomePage.connectKeplrButton().click();
    welcomePage.betaAgreeButton().click();
  });
  it('go to Assets page', function () {
    // go to Assets page
    let assets = new Assets();
    assets.goToAssertTab();

    assets.aktRow().click();
    assets.atomRow().should('be.visible');

    assets.checkVisabilityOfAllTableRows();
  });
});
