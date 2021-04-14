import { env, blocks, wallet,transfers,relayers } from '@starport/vuex'
import { Store } from 'vuex'
import { NavigatorState } from './index'
import liquidityModules from '@starport/tendermint-liquidity-js/index'

export default function init(store:Store<NavigatorState>):void {
	for (const moduleInit of Object.values(liquidityModules)) {
		moduleInit(store)
	}
	transfers(store)
	blocks(store)
	env(store)
	wallet(store)
	relayers(store)
}
