import { goToWithKeplr } from '../support/pages/goto';
import { Send } from '../support/pages/send';
import { SubPagesPaths } from '../support/sub-pages-paths';

describe('Navbar elements location and availibility', function () {
  beforeEach(() => {
    goToWithKeplr('/send');
  });

  it('Send - Navbar element', function () {
    let sendPage = new Send();
    let subPagePath = new SubPagesPaths();

    cy.url().should('contain', subPagePath.send_path);

    sendPage.sendToAdress().click();
    cy.url().should('contain', subPagePath.send_to_adress_path);

    sendPage.goBackWithArrowButton();
    cy.url().should('contain', subPagePath.send_path);

    sendPage.moveAssets().click();
    cy.url().should('contain', subPagePath.send_move_assets_path);

    sendPage.quitWithX();
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });
});
