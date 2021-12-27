import { Navbar } from '../../support/pages/navbar';
import { SendToAddressSubpage } from '../../support/pages/send-subpages/send-address';
import { WelcomePage } from '../../support/pages/welcome-page';

describe('Check availability of send/move subpage elements', function () {
  const recipientAddress = 'cosmos1ws4ae7ysl496j4e4pkg0yazpkf6nyrak3ptwpt';

  beforeEach(() => {
    cy.visit(Cypress.config().baseUrl);

    let welcomePage = new WelcomePage();

    welcomePage.connectKeplrButton().click();
    welcomePage.betaAgreeButton().click();
  });
  it('fill in form Recipient form', function () {
    let navbar = new Navbar();
    let sendToAddresseSubpage = new SendToAddressSubpage();

    navbar.send().click();
    sendToAddresseSubpage.goTo();

    sendToAddresseSubpage.header().should('be.visible');
    sendToAddresseSubpage.recipientAddressTextArea().type(recipientAddress);
    sendToAddresseSubpage.referenceMemoTextArea('test memo');

    sendToAddresseSubpage.checkbox().should('not.be.checked');
    sendToAddresseSubpage.continueButton().should('be.disabled');

    sendToAddresseSubpage.checkbox().check();

    sendToAddresseSubpage.continueButton().should('not.be.disabled');
  });
});
