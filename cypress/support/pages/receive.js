export class Receive {
  teble() {
    return cy.get('div[class="mx-auto max-w-md mb-20"]');
  }

  fillInSearchField(text) {
    this.searchField().type(text);
  }
  searchField() {
    return cy.get('div[class="suffix relative flex cursor-text"]').find('input');
  }

  quitWithX() {
    return this.xButton().click();
  }
  xButton() {
    return cy.get('div[class="inline-flex"]').find('button');
  }
}
