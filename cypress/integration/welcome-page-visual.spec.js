import { Env } from '../support/Env';
import { WelcomePage } from '../support/pages/welcome-page';

describe('Welcome page elements location and availibility', function () {
  beforeEach(() => {
    cy.visit(Env.LOCAL + '/welcome');
  });

  it('Connect Keplr button ', function () {
    let welcomePage = new WelcomePage();

    welcomePage.connectKeplrButton().should('be.visible');
  });

  it('Try the Demo button ', function () {
    let welcomePage = new WelcomePage();

    welcomePage.connectKeplrButton().should('be.visible');
    expect(welcomePage.tryTheDemoButtonIsVisible()).to.be.true;
  });
});
