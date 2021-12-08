import cypress from 'cypress';

import { Env } from '../support/Env';
import { Navbar } from '../support/pages/navbar';
import { WelcomePage } from '../support/pages/welcome-page';
// import test from  '../plugins/index';

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
  });
});
