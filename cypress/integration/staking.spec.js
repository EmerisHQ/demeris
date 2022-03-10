import { Asset } from '../support/pages/asset';
import { WelcomePage } from '../support/pages/welcome-page';

describe('Check Staking functionality', function () {
  beforeEach(() => {
    let asset = new Asset();
    let welcomePage = new WelcomePage();

    cy.visit(Cypress.config().baseUrl + '?VUE_APP_FEATURE_TRANSACTIONS_CENTER=true&VUE_APP_FEATURE_STAKING=true');
    welcomePage.connectKeplrButton().click();
    welcomePage.betaAgreeButton().click();
    asset.goToAtom();
  });

  it('shows staked Atom', function () {
    let asset = new Asset();
    let stakingTable = asset.getStakingTable();
    stakingTable.get('[data-cy=validator-row]').should('be.visible');
  });

  it('allows to stake', function () {
    let asset = new Asset();
    asset.stakeAtom(0.000001);
  });
});
