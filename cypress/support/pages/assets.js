import { Navbar } from './navbar';

export class Assets {
  goToAssertTab() {
    let navbar = new Navbar();
    // wait for navbar logo to be visible
    cy.waitFor(navbar.navbarLogo());
    //go to assert tab
    navbar.assetsTab().click();

    cy.url().should('include', '/assets');
  }

  tableTitlesRow() {
    // this.tableOfAssets().find
  }

  tableOfAssets() {
    return cy.get('//table');
  }
}
