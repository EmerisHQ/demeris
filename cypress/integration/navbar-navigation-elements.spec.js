import { Env } from '../support/Env';
import { Navbar } from '../support/pages/navbar';

describe('Navbar elements location and availibility', function () {
  it('Navbar element ', function () {
    cy.visit(Env.LOCAL);
    let navbar = new Navbar();
    // cy.waitFor(navbar.navbar());

    navbar.portfolioTab().click();
    // navbar.goToDashboard();
  });
});
