import { Navbar } from '../../support/pages/navbar';
import { MoveAssetsSubpage } from '../../support/pages/send-subpages/send-move';
import { WelcomePage } from '../../support/pages/welcome-page';

describe('Check availability of send/move subpage elements', function () {
  beforeEach(() => {
    cy.visit(Cypress.config().baseUrl);

    let welcomePage = new WelcomePage();

    welcomePage.connectKeplrButton().click();
    welcomePage.betaAgreeButton().click();
  });
  it.skip('fill in form amount form', function () {
    let navbar = new Navbar();
    let moveAssetsSubpage = new MoveAssetsSubpage();

    navbar.send().click();
    moveAssetsSubpage.goTo();

    moveAssetsSubpage.header().should('be.visible');
    moveAssetsSubpage.continueButton().should('be.disabled');
    moveAssetsSubpage.inputAmountOfAssets().type('123');
    moveAssetsSubpage.continueButton().should('not.be.disabled');
  });
});
