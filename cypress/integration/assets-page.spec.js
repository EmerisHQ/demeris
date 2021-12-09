import { Env } from '../support/Env';
import { Assets } from '../support/pages/assets';
import { WelcomePage } from '../support/pages/welcome-page';

describe('Check availability of Assets page elements', function () {
  const urlForTestPack = Env.LOCAL;

  it('go to Assets page', function () {
    cy.visit(urlForTestPack);

    // go to demo from /welcome page
    let welcomePage = new WelcomePage();

    // cy.wait('#tryTheDemoButton')
    welcomePage.tryTheDemoButton().click({ force: true });

    // go to Assets page
    let assets = new Assets();
    assets.goToAssertTab();

    assets.aktRow().click();
    assets.atomRow().should('be.visible');
  });
});
