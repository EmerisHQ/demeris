import { Navbar } from './navbar';

export class Receive {
  goTo() {
    const navbar = new Navbar();
    navbar.receive().click();
  }

  teble() {
    return cy.get('div[class="mx-auto max-w-md mb-20"]');
  }

  fillInSearchField(text) {
    this.searchField().type(text);
  }
  searchField() {
    return cy.get('div[class="relative flex cursor-text"]').find('input');
  }

  quitWithX() {
    return this.xButton().click();
  }
  xButton() {
    return cy.get('div[class="inline-flex"]').find('button');
  }
}
