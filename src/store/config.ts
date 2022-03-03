import liquidityModules from '@starport/tendermint-liquidity-js'
import { env } from '@starport/vuex'
import { Store } from 'vuex'

import { RootState } from './index'
import wallet from './wallet'
export default function init(store: Store<RootState>): void {
  for (const moduleInit of Object.values(liquidityModules)) {
    moduleInit(store)
  }
  env(store)
  wallet(store)
}
