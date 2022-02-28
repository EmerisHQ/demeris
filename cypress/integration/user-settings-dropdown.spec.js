import { Navbar } from '../support/pages/navbar';
import { UserDropdown } from '../support/pages/user-dropdown';
import { WelcomePage } from '../support/pages/welcome-page';

describe('Navbar elements location and availibility', function () {
  beforeEach(() => {
    cy.visit(Cypress.config().baseUrl);
    let welcomePage = new WelcomePage();

    welcomePage.connectKeplrButton().click();
    welcomePage.betaAgreeButton().click();
  });

  it('user settings dropdown - Navbar element', function () {
    let userDropdown = new UserDropdown();

    userDropdown.expand();

    userDropdown.support().should('have.attr', 'href', 'https://support.emeris.com');
    userDropdown.support().should('be.visible');

    userDropdown.twitter().should('have.attr', 'href', 'https://twitter.com/emerisHQ');
    userDropdown.twitter().should('be.visible');

    userDropdown.emerisCom().should('have.attr', 'href', 'https://emeris.com');
    userDropdown.emerisCom().should('be.visible');

    userDropdown.version().should('be.visible');
  });

  it('disconnect Keplr wallet', function () {
    let userDropdown = new UserDropdown();
    let navbar = new Navbar();
    userDropdown.expand();

    userDropdown.disconnectWallet().click();
    navbar.userSettings().should('contain', 'Demo Account');
  });
});
