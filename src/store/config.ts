import liquidityModules from '@starport/tendermint-liquidity-js';
import { Store } from 'vuex';

import env from './env';
import { RootState } from './index';
import wallet from './wallet';
export default function init(store: Store<RootState>): void {
  for (const moduleInit of Object.values(liquidityModules)) {
    moduleInit(store);
  }
  env(store);
  wallet(store);
}
