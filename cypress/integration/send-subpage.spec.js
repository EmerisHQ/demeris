import { Env } from '../support/Env';
import { Send } from '../support/pages/send';
import { WelcomePage } from '../support/pages/welcome-page';
import { SubPagesPaths } from '../support/sub-pages-paths';

describe('Navbar elements location and availibility', function () {
  beforeEach(() => {
    cy.visit(Env.LOCAL);
    let welcomePage = new WelcomePage();

    welcomePage.connectKeplrButton().click();
    welcomePage.betaAgreeButton().click();
  });

  it('Send - Navbar element', function () {
    let sendPage = new Send();
    let subPagePath = new SubPagesPaths();

    cy.url().should('eq', Env.LOCAL);

    sendPage.goTo();
    cy.url().should('contain', subPagePath.send_path);

    sendPage.sendToAdress().click();
    cy.url().should('contain', subPagePath.send_to_adress_path);

    sendPage.goBackWithArrowButton();
    cy.url().should('contain', subPagePath.send_path);

    sendPage.moveAssets().click();
    cy.url().should('contain', subPagePath.send_move_assets_path);

    sendPage.quitWithX();
    cy.url().should('eq', Env.LOCAL);
  });
});
