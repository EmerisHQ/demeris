import { Env } from '../support/Env';
import { WelcomePage } from '../support/pages/welcome-page';
// import {actions} from '../../src/store/demeris/actions'

describe('Check availability of Assets page elements', function () {
  beforeEach(() => {
    cy.visit(Env.LOCAL);
    cy.window().then((win) => {
      win.Cypress = true;
    });
  });
  it('connect Keplr', function () {
    // go to demo from /welcome page
    let welcomePage = new WelcomePage();

    welcomePage.connectKeplrButton().click();
    welcomePage.betaAgreeButton().click();
  });
});
