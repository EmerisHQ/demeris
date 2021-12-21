import { Env } from '../support/Env';
import { Navbar } from '../support/pages/navbar';
import { WelcomePage } from '../support/pages/welcome-page';
import { SubPagesPaths } from '../support/sub-pages-paths';

describe('Navbar elements location and availibility', function () {
  beforeEach(() => {
    cy.visit(Env.LOCAL);
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
    cy.url().should('contain', subPagePath.assets_path);

    // go to Portwolio via Tab
    // check url /path
    navbar.portfolioTab().click();
    cy.url().should('eq', Env.LOCAL);

    // go to Pools
    // check url /path
    navbar.poolsTab().click();
    cy.url().should('contain', subPagePath.pools_path);

    //assert logo visability
    cy.should('be.true', navbar.navbarLogoIsVisible());

    // go to Portfolio via logo
    // check url /path    navbar.navbarLogo.click()
    navbar.navbarLogo().click();
    cy.url().should('eq', Env.LOCAL);
  });

  it('"Receive" navbar element', function () {
    let navbar = new Navbar();
    let subPagePath = new SubPagesPaths();

    cy.url().should('eq', Env.LOCAL);

    navbar.receive().click();
    cy.url().should('contain', subPagePath.receive_path);

    cy.matchImageSnapshot('receiveSubPage');
  });
});
