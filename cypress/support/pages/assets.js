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

  aktRow() {
    return this.tableAssetsRow('AKT');
  }

  atomRow() {
    return this.tableAssetsRow('ATOM');
  }

  lunaRow() {
    return this.tableAssetsRow('LUNA');
  }

  gravityRow() {
    return this.tableAssetsRow('Gravity 1');
  }

  tableAssetsRow(assetCode) {
    return this.tableOfAssets().contains('tr', assetCode);
  }

  tableOfAssets() {
    return cy.get('table');
  }
}
