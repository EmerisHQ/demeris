import { env, blocks, wallet,transfers,relayers } from '@starport/vuex'
import { Store } from 'vuex'
import { RootState } from './index'
import liquidityModules from '@starport/tendermint-liquidity-js'

export default function init(store:Store<RootState>):void {
	for (const moduleInit of Object.values(liquidityModules)) {
		moduleInit(store)
	}
	transfers(store)
	blocks(store)
	env(store)
	wallet(store)
	relayers(store)
}
