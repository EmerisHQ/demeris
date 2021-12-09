import { Env } from '../support/Env';
// import { Navbar } from '../support/pages/navbar';
// import { WelcomePage } from '../support/pages/welcome-page';

describe('Initial Test - check if page (local) is reachable and Cypress env forks', function () {
  it('log in', function () {
    cy.visit(Env.LOCAL);
    cy.wait(2000000);
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
    // cy.visit(Env.LOCAL);
    // let welcomePage = new WelcomePage();
    // // welcomePage.tryTheDemoButtonIsVisible()
    // welcomePage.tryTheDemoButton().click();
  });
});
