import { Env } from '../support/Env';
import { WelcomePage } from '../support/pages/welcome-page';

describe('Portfolio visual check', function () {
  beforeEach(() => {
    cy.visit(Env.LOCAL);
    let welcomePage = new WelcomePage();
    welcomePage.tryTheDemoButton().click();
  });

  it('total balance check', function () {
    cy.contains('Total balance').should('be.visible');
    cy.get('*[class="total-price"]').should('contain', '$');
  });
});
