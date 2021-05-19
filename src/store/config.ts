import liquidityModules from '@starport/tendermint-liquidity-js';
import { blocks, env, relayers,transfers, wallet } from '@starport/vuex';
import { Store } from 'vuex';

import { RootState } from './index';

export default function init(store: Store<RootState>): void {
  for (const moduleInit of Object.values(liquidityModules)) {
    moduleInit(store);
  }
  transfers(store);
  blocks(store);
  env(store);
  wallet(store);
  relayers(store);
}
