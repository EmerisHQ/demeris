import { Navbar } from '../support/pages/navbar';
import { WelcomePage } from '../support/pages/welcome-page';
import { SubPagesPaths } from '../support/sub-pages-paths';

describe('Navbar elements location and availibility', function () {
  beforeEach(() => {
    cy.visit(Cypress.config().baseUrl);

    let welcomePage = new WelcomePage();
    welcomePage.connectKeplrButton().click();
    welcomePage.betaAgreeButton().click();
  });

  it('Portfolio, Assets, Pools, Logo - Navbar elements', function () {
    let navbar = new Navbar();
    let subPagePath = new SubPagesPaths();

    // go to Assets
    // check url /path
    navbar.assetsTab().click();
    cy.url().should('eq', Cypress.config().baseUrl + subPagePath.assets_path);

    // go to Portwolio via Tab
    // check url /path
    navbar.portfolioTab().click();
    cy.url().should('eq', Cypress.config().baseUrl);

    // go to Pools
    // check url /path
    navbar.poolsTab().click();
    cy.url().should('eq', Cypress.config().baseUrl + subPagePath.pools_path);

    // go to Portfolio via logo
    // check url /path
    navbar.navbarLogo().click();
    cy.url().should('eq', Cypress.config().baseUrl);
  });

  it('"Receive" navbar element', function () {
    let navbar = new Navbar();
    let subPagePath = new SubPagesPaths();

    navbar.receive().click();
    cy.url().should('eq', Cypress.config().baseUrl + subPagePath.receive_path);

    cy.viewport(1000, 660);
    cy.matchImageSnapshot('receiveSubPage');
  });

  it('"Send" navbar element', function () {
    let navbar = new Navbar();
    let subPagePath = new SubPagesPaths();

    navbar.send().click();
    cy.url().should('eq', Cypress.config().baseUrl + subPagePath.send_path);

    cy.viewport(1000, 660);
    cy.matchImageSnapshot('sendSubPage');
  });
});
