import { Env } from '../support/Env';
import { Navbar } from '../support/pages/Navbar';
import { WelcomePage } from '../support/pages/WelcomePage';

describe('Initial Test - check if page (local) is reachable and Cypress env forks', function () {
  it('log in', function () {
    // let navbar = new Navbar();
    // cy.visit(Env.LOCAL);
    // navbar.goToDashboard();
  });

  it('run browser with Keplr extension', function () {
    // cy.clearExtensionStorage('local');
    // let navbar = new Navbar();
    // cy.visit(Env.LOCAL);
    // navbar.goToDashboard();
  });

  it('lounch demo version', function () {
    cy.visit(Env.LOCAL);
    let welcomePage = new WelcomePage();
    // welcomePage.tryTheDemoButtonIsVisible()
    welcomePage.tryTheDemoButton().click();

    //cy.launchDemo()
  });
  describe('Login', () => {
    it('should be publicly accessible', () => {
      cy.visit(Env.LOCAL);
      let welcomePage = new WelcomePage();
      welcomePage.tryTheDemoButton().click();
      cy.matchImageSnapshot('mainpage');
    });
  });
});
