import { Env } from '../support/Env';
import { Navbar } from '../support/pages/Navbar';

describe('Initial Test - check if page (local) is reachable and Cypress env forks', function () {
  it('log in', function () {
    let navbar = new Navbar();

    cy.visit(Env.LOCAL);

    // navbar.goToDashboard()
  });
});
