import { Navbar } from './navbar';

export class Send {
  goTo() {
    const navbar = new Navbar();
    navbar.send().click();
  }

  moveAssets() {
    return this.blockContainingBothOptions().contains('Move assets');
  }
  sendToAdress() {
    return this.blockContainingBothOptions().contains('Send to address');
  }

  blockContainingBothOptions() {
    //contains both "Send to adress" and "Move assets" blocks
    return cy.get('div[class="mt-8 pb-8 flex space-x-8"]');
  }

  goBackWithArrowButton() {
    this.backButton().click();
  }

  quitWithX() {
    this.xButton().click();
  }

  backButton() {
    // this button is visible on further subpages
    // 'send/move' and 'send/adress'
    return cy.get('div[class="inline-flex"]').find('button');
  }

  xButton() {
    return cy.get('div[class="inline-flex ml-auto"]').find('button');
  }
}
