import { SubPagesPaths } from '../../sub-pages-paths';
import { Send } from '../send';

export class MoveAssetsSubpage {
  goTo() {
    let send = new Send();
    let subpagesPaths = new SubPagesPaths();

    if (send.moveAssets().should('be.visible')) {
      send.moveAssets().click();
    } else {
      cy.visit(Cypress.config().baseUrl + subpagesPaths.send_move_assets_path);
      send.moveAssets().click();
    }
  }

  //#region Amount
  header() {
    return cy.get('h2').contains('Move assets');
  }

  inputAmountOfAssets() {
    return cy.get('.uppercase > .flex-1 > .flex > .flexible-input__input');
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

  //#endregion Amount
  //#region Review
}