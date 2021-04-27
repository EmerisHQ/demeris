import { ActionTree, ActionContext } from 'vuex';
import * as API from '@/types/api';
import { RootState } from '@/store';
import {SpVuexError } from '@starport/vuex'
import { State } from './state';
import { DemerisActionTypes, DemerisActionParams , DemerisSubscriptions} from './action-types';
import { DemerisMutationTypes } from './mutation-types';

export interface Actions {
  [DemerisActionTypes.GET_BALANCES](
    { commit, rootGetters, getters }: ActionContext<State, RootState>,
    { subscribe, params }: DemerisActionParams,
  ): Promise<Array<API.Balance>>;
  [DemerisActionTypes.GET_VERIFIED_PATH](
    { commit, rootGetters, getters }: ActionContext<State, RootState>,
    { subscribe, params }: DemerisActionParams,
  ): Promise<API.VerifiedPath>;
  [DemerisActionTypes.GET_FEE_ADDRESS](
    { commit, rootGetters, getters }: ActionContext<State, RootState>,
    { subscribe, params }: DemerisActionParams,
  ): Promise<API.FeeAddress>;
  [DemerisActionTypes.GET_FEE](
    { commit, rootGetters, getters }: ActionContext<State, RootState>,
    { subscribe, params }: DemerisActionParams,
  ): Promise<API.Fee>;
  [DemerisActionTypes.GET_FEE_TOKEN](
    { commit, rootGetters, getters }: ActionContext<State, RootState>,
    { subscribe, params }: DemerisActionParams,
  ): Promise<API.FeeToken>;
  [DemerisActionTypes.GET_STAKING_BALANCES](
    { commit, rootGetters, getters }: ActionContext<State, RootState>,
    { subscribe, params }: DemerisActionParams,
  ): Promise<Array<API.StakingBalance>>;
  [DemerisActionTypes.GET_PRICES](
    { commit, rootGetters, getters }: ActionContext<State, RootState>,
    { subscribe }: DemerisActionParams,
  ): Promise<Array<API.Price>>;
  [DemerisActionTypes.GET_CHAINS](
    { commit, rootGetters, getters }: ActionContext<State, RootState>,
    { subscribe }: DemerisActionParams,
  ): Promise<Array<API.Chain>>;
  [DemerisActionTypes.GET_VERIFIED_DENOMS](
    { commit, rootGetters, getters }: ActionContext<State, RootState>,
    { subscribe }: DemerisActionParams,
  ): Promise<Array<API.VerifiedDenom>>;
  [DemerisActionTypes.GET_PRIMARY_CHANNEL](
    { commit, rootGetters, getters }: ActionContext<State, RootState>,
    { subscribe, params }: DemerisActionParams,
  ): Promise<API.PrimaryChannel>;
  [DemerisActionTypes.GET_CHAIN_STATUS](
    { commit, rootGetters, getters }: ActionContext<State, RootState>,
    { subscribe, params }: DemerisActionParams,
  ): Promise<API.ChainStatus>;
  [DemerisActionTypes.INIT]({ dispatch, rootGetters }: ActionContext<State, RootState>): void;
  [DemerisActionTypes.RESET_STATE]({ commit }: ActionContext<State, RootState>): void;
  [DemerisActionTypes.UNSUBSCRIBE]({ commit }: ActionContext<State, RootState>, subscription:DemerisSubscriptions): void;
  [DemerisActionTypes.STORE_UPDATE]({ state, dispatch }: ActionContext<State, RootState>): void;
}

export const actions: ActionTree<State, RootState> & Actions = {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async [DemerisActionTypes.GET_BALANCES]({ commit, rootGetters, getters }, { subscribe = false, params  }) {
		try {
		//	let response = rootGetters['common/env/client'].query('/balances/'+(params as API.BalanceReq).address);
			if (subscribe) {
				commit('SUBSCRIBE', { action: DemerisActionTypes.GET_BALANCES, payload: {params} })
			}
		}catch(e) {
			throw new SpVuexError(
				'Demeris:GetBalances',
				'Could not perform API query.'
			)
		}
    return getters['getBalances'](JSON.stringify(params));
  },
  async [DemerisActionTypes.GET_VERIFIED_PATH]({ commit, rootGetters, getters }, { subscribe = false, params }) {
    return {} as API.VerifiedPath;
  },
  async [DemerisActionTypes.GET_FEE_ADDRESS]({ commit, rootGetters, getters }, { subscribe = false, params }) {
    return {} as API.FeeAddress;
  },
  async [DemerisActionTypes.GET_FEE]({ commit, rootGetters, getters }, { subscribe = false, params }) {
    return {} as API.Fee;
  },
  async [DemerisActionTypes.GET_FEE_TOKEN]({ commit, rootGetters, getters }, { subscribe = false, params }) {
    return {} as API.FeeToken;
  },
  async [DemerisActionTypes.GET_STAKING_BALANCES]({ commit, rootGetters, getters }, { subscribe = false, params }) {
    return [];
  },
  async [DemerisActionTypes.GET_PRICES]({ commit, rootGetters, getters }, { subscribe = false }) {
    return [];
  },
  async [DemerisActionTypes.GET_CHAINS]({ commit, rootGetters, getters }, { subscribe = false }) {
    return [];
  },
  async [DemerisActionTypes.GET_VERIFIED_DENOMS]({ commit, rootGetters, getters }, { subscribe = false }) {
    return [];
  },
  async [DemerisActionTypes.GET_PRIMARY_CHANNEL]({ commit, rootGetters, getters }, { subscribe = false, params }) {
    return {} as API.PrimaryChannel;
  },
  async [DemerisActionTypes.GET_CHAIN_STATUS]({ commit, rootGetters, getters }, { subscribe = false, params }) {
    return {} as API.ChainStatus;
  },
  [DemerisActionTypes.INIT]({ dispatch, rootGetters }) {
    console.log('Vuex nodule: demeris initialized!');
    if (rootGetters['common/env/client']) {
      rootGetters['common/env/client'].on('newblock', () => {
        dispatch(DemerisActionTypes.STORE_UPDATE);
      });
    }
  },
  [DemerisActionTypes.RESET_STATE]({ commit }) {
    commit(DemerisMutationTypes.RESET_STATE);
  },
  [DemerisActionTypes.STORE_UPDATE]({ state, dispatch }) {
    state._Subscriptions.forEach(subscription => {
      dispatch(subscription.action, subscription.payload);
    });
  },
  [DemerisActionTypes.UNSUBSCRIBE]({ commit }, subscription) {
		commit('UNSUBSCRIBE', subscription)
	},
};
