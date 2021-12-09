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

  checkVisabilityOfAllTableRows() {
    return this.tableOfAssets().get('>tr').each().should('be.visible'); // Iterate through each 'tr'

    // cy.get('>tr').each().should('be.visible') // Iterate through each 'tr'
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

  tableAssetsRow(assetCode) {
    return this.tableOfAssets().contains('tr', assetCode);
  }

  tableOfAssets() {
    return cy.get('table');
  }
}
