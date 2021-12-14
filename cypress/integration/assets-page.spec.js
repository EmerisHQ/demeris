import { Env } from '../support/Env';
import { Assets } from '../support/pages/assets';
import { WelcomePage } from '../support/pages/welcome-page';

describe('Check availability of Assets page elements', function () {
  beforeEach(() => {
    cy.visit(Env.LOCAL);
  });
  it('go to Assets page', function () {
    // go to demo from /welcome page
    let welcomePage = new WelcomePage();

    // cy.wait('#tryTheDemoButton')
    welcomePage.tryTheDemoButton().click({ force: true });

    // go to Assets page
    let assets = new Assets();
    assets.goToAssertTab();

    assets.aktRow().click();
    assets.atomRow().should('be.visible');

    assets.checkVisabilityOfAllTableRows();
  });
});
