import { Env } from '../support/Env';
// import { Navbar } from '../support/pages/navbar';
// import { WelcomePage } from '../support/pages/welcome-page';

describe('Initial Test - check if page (local) is reachable and Cypress env forks', function () {
  beforeEach(() => {
    cy.visit(Env.LOCAL);
  });

  it('log in', function () {
    cy.visit(Env.LOCAL);
    cy.wait(2000000);
  });
});
