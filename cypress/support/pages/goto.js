import { WelcomePage } from './welcome-page';

export function goToWithKeplr(url) {
  let welcomePage = new WelcomePage();
  cy.visit(Cypress.config().baseUrl + url);
  welcomePage.connectKeplrButton().click();
  welcomePage.betaAgreeButton().click();
}
