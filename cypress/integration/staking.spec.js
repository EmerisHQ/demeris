import { Asset } from '../support/pages/asset';
import { goToWithKeplr } from '../support/pages/goto';

describe('Check Staking functionality', function () {
  beforeEach(() => {
    goToWithKeplr('/asset/uatom?VUE_APP_FEATURE_TRANSACTIONS_CENTER=true&VUE_APP_FEATURE_STAKING=true');
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
