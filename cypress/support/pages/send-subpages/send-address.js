import { SubPagesPaths } from '../../sub-pages-paths';
import { Send } from '../send';

export class SendToAddressSubpage {
  goTo() {
    let send = new Send();
    let subpagesPaths = new SubPagesPaths();

    if (send.moveAssets().should('be.visible')) {
      send.sendToAdress().click();
    } else {
      cy.visit(Cypress.config().baseUrl + subpagesPaths.send_move_assets_path);
      send.moveAssets().click();
    }
  }

  header() {
    return cy.get('h2').contains('Enter an address');
  }

  inputAmountOfAssets() {
    return cy.get('input[placeholder="0"]');
  }

  moveSelectAsset() {
    return cy.get('button').contains('Select asset');
  }

  toSelectChain() {
    return cy.get('button').contains('Select chain');
  }

  continueButton() {
    return cy.get('span').contains('Continue').parent().get('button');
  }
}