import { mount } from '@vue/test-utils';

import balancesFixture from '../../../../tests/fixtures/balances.json';
import AssetChainsIndicator from './AssetChainsIndicator.vue';

describe('Asset Chains Indicator', () => {
  it('should limit chains count', () => {
    const wrapper = mount(AssetChainsIndicator, {
      props: {
        balances: balancesFixture,
        denom: 'atom',
        maxChainsCount: 4,
      },
    });
    expect(wrapper.text()).toContain('4+ chains');
  });
});
