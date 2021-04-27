import { ActionTree,ActionContext } from 'vuex';
import * as API from '@/types/api'
import { RootState } from '@/store';

import { State } from './state';
import { DemerisActionTypes } from './action-types';
import { DemerisMutationTypes } from './mutation-types';

export interface Actions {
  [DemerisActionTypes.GET_BALANCES](): Array<API.Balance>
	[DemerisActionTypes.GET_VERIFIED_PATH](): API.VerifiedPath
	[DemerisActionTypes.GET_FEE_ADDRESS](): API.FeeAddress
	[DemerisActionTypes.GET_FEE](): API.Fee
	[DemerisActionTypes.GET_FEE_TOKEN](): API.FeeToken
	[DemerisActionTypes.GET_STAKING_BALANCES](): Array<API.StakingBalance>
	[DemerisActionTypes.GET_PRICES](): Array<API.Price>
	[DemerisActionTypes.GET_CHAINS](): Array<API.Chain>
	[DemerisActionTypes.GET_VERIFIED_DENOMS](): Array<API.VerifiedDenom>
	[DemerisActionTypes.GET_PRIMARY_CHANNEL](): API.PrimaryChannel
	[DemerisActionTypes.GET_CHAIN_STATUS](): API.ChainStatus
	[DemerisActionTypes.INIT]({ dispatch,rootGetters}: ActionContext<State,RootState>): void
	[DemerisActionTypes.RESET_STATE]({ commit }: ActionContext<State,RootState>): void
	[DemerisActionTypes.UNSUBSCRIBE](): void
	[DemerisActionTypes.STORE_UPDATE]({ state, dispatch }: ActionContext<State,RootState>): void

}

export const actions: ActionTree<State, RootState> & Actions = {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  [DemerisActionTypes.GET_BALANCES]() { return []},
	[DemerisActionTypes.GET_VERIFIED_PATH]() { return {} as API.VerifiedPath},
	[DemerisActionTypes.GET_FEE_ADDRESS]() { return {} as API.FeeAddress},
	[DemerisActionTypes.GET_FEE]() { return {} as API.Fee},
	[DemerisActionTypes.GET_FEE_TOKEN]() {return{} as API.FeeToken},
	[DemerisActionTypes.GET_STAKING_BALANCES]() { return []},
	[DemerisActionTypes.GET_PRICES]() {return []},
	[DemerisActionTypes.GET_CHAINS]() {return []},
	[DemerisActionTypes.GET_VERIFIED_DENOMS]() {return []},
	[DemerisActionTypes.GET_PRIMARY_CHANNEL]() {return {} as API.PrimaryChannel},
	[DemerisActionTypes.GET_CHAIN_STATUS]() { return {} as API.ChainStatus},
	[DemerisActionTypes.INIT]({ dispatch, rootGetters }) {
		console.log('Vuex nodule: demeris initialized!')
		if (rootGetters['common/env/client']) {
			rootGetters['common/env/client'].on('newblock', () => {
				dispatch(DemerisActionTypes.STORE_UPDATE)
			})
		}
	},
	[DemerisActionTypes.RESET_STATE]({commit}) {
		commit(DemerisMutationTypes.RESET_STATE)
	},
	[DemerisActionTypes.STORE_UPDATE]({ state, dispatch }) { 
		state._Subscriptions.forEach((subscription) => {
			dispatch(subscription.action, subscription.payload)
		})
	},
	[DemerisActionTypes.UNSUBSCRIBE]() { },
};