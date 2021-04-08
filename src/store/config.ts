import { env, blocks, wallet, transfers, relayers } from '@starport/vuex'
import { Store } from 'vuex'
import { NavigatorState } from './index'

export default function init(store: Store<NavigatorState>): void {
    transfers(store)
    blocks(store)
    env(store)
    wallet(store)
    relayers(store)
}