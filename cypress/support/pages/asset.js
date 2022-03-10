export class Asset {
  goToAtom() {
    cy.get('[data-cy=asset-row]').contains('ATOM').click();
  }

  stakeAmountField() {
    return cy.get('[data-cy=denom-amount-input]');
  }

  stakeAtom(amount) {
    cy.get('[data-cy=stake-button]').click();
    cy.get('[data-cy=validator-table-stake]').first().click();
    this.stakeAmountField().click();
    this.stakeAmountField().type(amount);
    cy.get('[data-cy=stake-continue-button]').should('not.be.disabled');
  }

  getStakingTable() {
    return cy.get('[data-cy=staking-table]');
  }
}
