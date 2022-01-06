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
  //#region RECIPIENT step
  recipientHeader() {
    return cy.get('h2').contains('Enter an address');
  }

  toARecipientAddressTextField() {
    return cy.get('input[placeholder="Recipient address"]');
  }
  referenceMemoInput() {
    return cy.get('input[placeholder="Add reference (memo)"]');
  }

  checkbox() {
    return cy.get('input[type="checkbox"]');
  }

  continueButton() {
    return cy.get('span').contains('Continue').parent().get('button');
  }
  //#endregion RECIPIENT step

  //#region AMOUNT step
  amountHeader() {
    return cy.get('h2').contains('Enter an amount');
  }

  inputAmountOfAssets() {
    return cy.get('input[placeholder="0"]');
  }

  fees() {
    return cy.get('button').contains('Select asset');
  }

  toSelectChain() {
    return cy.get('button').contains('Select chain');
  }

  selectSlowTransactionFee() {
    selectTransactionFee('Slow');
  }

  selectFastTransactionFee() {
    selectTransactionFee('Fast');
  }

  selectTransactionFee(fee) {
    cy.get('div').contains('Fees (included)');
    cy.get('button').contains(fee).click();
  }
  //#endregion AMOUNT step

  //#region REVIEW step
  reviewHeader() {
    return cy.get('h2').contains('Review your transfer details');
  }

  confirnAndContinueButton() {
    return cy.get('span').contains('Confirm and continue').parent().get('button');
  }

  //#endregion REVIEW step
}
