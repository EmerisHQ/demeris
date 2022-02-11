import { Navbar } from '../support/pages/navbar';
import { WelcomePage } from '../support/pages/welcome-page';
import { SubPagesPaths } from '../support/sub-pages-paths';

describe('compare each subpage with screenshot', () => {
  beforeEach(() => {
    cy.visit(Cypress.config().baseUrl);

    let welcomePage = new WelcomePage();

    welcomePage.connectKeplrButton().click();
    welcomePage.betaAgreeButton().click();
  });

  it.skip('Assets subpage', () => {
    let navbar = new Navbar();
    let subPagePath = new SubPagesPaths();

    navbar.assetsTab().click();
    cy.url().should('contain', subPagePath.assets_path);

    cy.viewport(1000, 660);
    cy.matchImageSnapshot('assetsSubpage');
  });

  it.skip('Pools subpage', () => {
    let navbar = new Navbar();
    let subPagePath = new SubPagesPaths();

    navbar.poolsTab().click();
    cy.url().should('contain', subPagePath.pools_path);

    cy.viewport(1000, 660);
    cy.matchImageSnapshot('poolsSubpage');
  });

  it.skip('Main page', () => {
    let navbar = new Navbar();

    navbar.navbarLogo().click();
    cy.url().should('eq', Cypress.config().baseUrl);

    cy.viewport(1000, 660);
    cy.matchImageSnapshot('mainpage');
  });
});
