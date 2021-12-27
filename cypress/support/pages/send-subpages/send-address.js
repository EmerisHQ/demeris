import { SubPagesPaths } from '../../sub-pages-paths';
import { Send } from '../send';

export class SendToAddressSubpage {
  goTo() {
    let send = new Send();
    let subpagesPaths = new SubPagesPaths();

    if (send.sendToAdress().should('be.visible')) {
      send.sendToAdress().click();
    } else {
      cy.visit(Cypress.config().baseUrl + subpagesPaths.send_to_adress_path);
      send.sendToAdress().click();
    }
  }

  header() {
    return cy.get('h2').contains('Enter an address');
  }

  recipientAddressTextArea() {
    return cy.get('textarea[placeholder="Recipient address"]');
  }

  referenceMemoTextArea() {
    return cy.get('input[placeholder="Add reference (memo)"]');
  }
  checkbox() {
    return cy.get('input[type="checkbox"]');
  }
  continueButton() {
    return cy.get('span').contains('Continue').parent().get('button');
  }
}
