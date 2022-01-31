import { Navbar } from '../../../support/pages/navbar';
import { MoveAssetsSubpage } from '../../../support/pages/send-subpages/send-move';
import { WelcomePage } from '../../../support/pages/welcome-page';

describe('Check availability of send/move subpage elements', function () {
  beforeEach(() => {
    cy.visit(Cypress.config().baseUrl);

    let welcomePage = new WelcomePage();

    welcomePage.connectKeplrButton().click();
    welcomePage.betaAgreeButton().click();
  });
  it('fill in form amount form', function () {
    const testInputValue = '1';

    let navbar = new Navbar();
    let moveAssetsSubpage = new MoveAssetsSubpage();

    navbar.send().click();
    moveAssetsSubpage.goTo();
    //Amount step
    moveAssetsSubpage.inputAmountOfAssets().type(testInputValue);
    moveAssetsSubpage.continueButton().click();

    //Review step
    moveAssetsSubpage
      .learnMoreButton()
      .should(
        'have.attr',
        'href',
        'https://blog.cosmos.network/deep-dive-how-will-ibc-create-value-for-the-cosmos-hub-eedefb83c7a0',
      );
    moveAssetsSubpage.continueButton().click();

    //Move step
    //at this point we get the popup
    //informing that AKT is needed for fees
  });
});
