import { ActionTree, ActionContext } from 'vuex';
import * as API from '@/types/api';
import { RootState } from '@/store';
import {SpVuexError } from '@starport/vuex'
import { State } from './state';
import { DemerisActionTypes, DemerisActionParams , DemerisSubscriptions} from './action-types';
import { DemerisMutationTypes } from './mutation-types';
import axios from 'axios'
export interface Actions {
  [DemerisActionTypes.GET_BALANCES](
    { commit, getters }: ActionContext<State, RootState>,
    { subscribe, params }: DemerisActionParams,
  ): Promise<Array<API.Balance>>;
  [DemerisActionTypes.GET_VERIFIED_PATH](
    { commit, getters }: ActionContext<State, RootState>,
    { subscribe, params }: DemerisActionParams,
  ): Promise<API.VerifiedPath>;
  [DemerisActionTypes.GET_FEE_ADDRESS](
    { commit, getters }: ActionContext<State, RootState>,
    { subscribe, params }: DemerisActionParams,
  ): Promise<API.FeeAddress>;
  [DemerisActionTypes.GET_FEE](
    { commit, getters }: ActionContext<State, RootState>,
    { subscribe, params }: DemerisActionParams,
  ): Promise<API.Fee>;
  [DemerisActionTypes.GET_FEE_TOKEN](
    { commit, getters }: ActionContext<State, RootState>,
    { subscribe, params }: DemerisActionParams,
  ): Promise<API.FeeToken>;
  [DemerisActionTypes.GET_STAKING_BALANCES](
    { commit, getters }: ActionContext<State, RootState>,
    { subscribe, params }: DemerisActionParams,
  ): Promise<Array<API.StakingBalance>>;
  [DemerisActionTypes.GET_PRICES](
    { commit, getters }: ActionContext<State, RootState>,
    { subscribe }: DemerisActionParams,
  ): Promise<Array<API.Price>>;
  [DemerisActionTypes.GET_CHAINS](
    { commit, getters }: ActionContext<State, RootState>,
    { subscribe }: DemerisActionParams,
  ): Promise<Array<API.Chain>>;
  [DemerisActionTypes.GET_VERIFIED_DENOMS](
    { commit,  getters }: ActionContext<State, RootState>,
    { subscribe }: DemerisActionParams,
  ): Promise<Array<API.VerifiedDenom>>;
  [DemerisActionTypes.GET_PRIMARY_CHANNEL](
    { commit, getters }: ActionContext<State, RootState>,
    { subscribe, params }: DemerisActionParams,
  ): Promise<API.PrimaryChannel>;
  [DemerisActionTypes.GET_CHAIN_STATUS](
    { commit, getters }: ActionContext<State, RootState>,
    { subscribe, params }: DemerisActionParams,
  ): Promise<API.ChainStatus>;
  [DemerisActionTypes.INIT]({ dispatch, rootGetters }: ActionContext<State, RootState>): void;
  [DemerisActionTypes.RESET_STATE]({ commit }: ActionContext<State, RootState>): void;
  [DemerisActionTypes.UNSUBSCRIBE]({ commit }: ActionContext<State, RootState>, subscription:DemerisSubscriptions): void;
  [DemerisActionTypes.STORE_UPDATE]({ state, dispatch }: ActionContext<State, RootState>): void;
}

export const actions: ActionTree<State, RootState> & Actions = {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async [DemerisActionTypes.GET_BALANCES]({ commit, getters }, { subscribe = false, params  }) {
		try {
      // TODO: Correct API endpoint params
      const response =  await axios.get('/balances/'+(params as API.BalanceReq).address);
      commit(DemerisMutationTypes.SET_BALANCES,{params, value: response.data});
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
  async [DemerisActionTypes.GET_VERIFIED_PATH]({ commit, getters }, { subscribe = false, params }) {

		try {
      // TODO: Correct API endpoint params
        const response =  await axios.get('/verified_path/'+(params as API.VerifiedPathReq).chain_id);
        commit(DemerisMutationTypes.SET_VERIFIED_PATH,{params, value: response.data});
        if (subscribe) {
          commit('SUBSCRIBE', { action: DemerisActionTypes.GET_VERIFIED_PATH, payload: {params} })
        }
      }catch(e) {
        throw new SpVuexError(
          'Demeris:GetVerifiedPath',
          'Could not perform API query.'
        )
      }
      return getters['getVerifiedPath'](JSON.stringify(params));
    
  },
  async [DemerisActionTypes.GET_FEE_ADDRESS]({ commit, getters }, { subscribe = false, params }) {
    
		try {      
      // TODO: Correct API endpoint params
      const response =  await axios.get('/fee_address/'+(params as API.FeeAddressReq).chain_id);
      commit(DemerisMutationTypes.SET_FEE_ADDRESS,{params, value: response.data});
      if (subscribe) {
        commit('SUBSCRIBE', { action: DemerisActionTypes.GET_FEE_ADDRESS, payload: {params} })
      }
    }catch(e) {
      throw new SpVuexError(
        'Demeris:GetFeeAddress',
        'Could not perform API query.'
      )
    }
    return getters['getFeeAddress'](JSON.stringify(params));
  },
  async [DemerisActionTypes.GET_FEE]({ commit, getters }, { subscribe = false, params }) {
    
		try {
      // TODO: Correct API endpoint params
      const response =  await axios.get('/fee/'+(params as API.FeeReq).chain_id);
      commit(DemerisMutationTypes.SET_FEE,{params, value: response.data});
      if (subscribe) {
        commit('SUBSCRIBE', { action: DemerisActionTypes.GET_FEE, payload: {params} })
      }
    }catch(e) {
      throw new SpVuexError(
        'Demeris:GetFee',
        'Could not perform API query.'
      )
    }
    return getters['getFee'](JSON.stringify(params));
  },
  async [DemerisActionTypes.GET_FEE_TOKEN]({ commit, getters }, { subscribe = false, params }) {
    
		try {
      // TODO: Correct API endpoint params
      const response =  await axios.get('/fee_token/'+(params as API.FeeTokenReq).chain_id);
      commit(DemerisMutationTypes.SET_FEE_TOKEN,{params, value: response.data});
      if (subscribe) {
        commit('SUBSCRIBE', { action: DemerisActionTypes.GET_FEE_TOKEN, payload: {params} })
      }
    }catch(e) {
      throw new SpVuexError(
        'Demeris:GetFeeToken',
        'Could not perform API query.'
      )
    }
    return getters['getFeeToken'](JSON.stringify(params));
  },
  async [DemerisActionTypes.GET_STAKING_BALANCES]({ commit, getters }, { subscribe = false, params }) {
    
		try {
      // TODO: Correct API endpoint params
      const response =  await axios.get('/staking_balances/'+(params as API.StakingBalanceReq).address);
      commit(DemerisMutationTypes.SET_STAKING_BALANCES,{params, value: response.data});
      if (subscribe) {
        commit('SUBSCRIBE', { action: DemerisActionTypes.GET_STAKING_BALANCES, payload: {params} })
      }
    }catch(e) {
      throw new SpVuexError(
        'Demeris:GetStakingBalances',
        'Could not perform API query.'
      )
    }
    return getters['getStakingBalances'](JSON.stringify(params));
  },
  async [DemerisActionTypes.GET_PRICES]({ commit, getters }, { subscribe = false }) {
    
		try {
      const response =  await axios.get('/prices');
      commit(DemerisMutationTypes.SET_PRICES, {value: response.data})
      if (subscribe) {
        commit('SUBSCRIBE', { action: DemerisActionTypes.GET_PRICES, payload: {} })
      }
    }catch(e) {
      throw new SpVuexError(
        'Demeris:GetPrices',
        'Could not perform API query.'
      )
    }
    return getters['getPrices'];
  },
  async [DemerisActionTypes.GET_CHAINS]({ commit, getters }, { subscribe = false }) {
    
		try {
      const response =  await axios.get('/chains');
      commit(DemerisMutationTypes.SET_CHAINS, {value: response.data})
      if (subscribe) {
        commit('SUBSCRIBE', { action: DemerisActionTypes.GET_CHAINS, payload: {} })
      }
    }catch(e) {
      throw new SpVuexError(
        'Demeris:GetChains',
        'Could not perform API query.'
      )
    }
    return getters['getChains'];
  },
  async [DemerisActionTypes.GET_VERIFIED_DENOMS]({ commit,  getters }, { subscribe = false }) {
    try
    {
      const response =  await axios.get('/verified_denoms');
      commit(DemerisMutationTypes.SET_VERIFIED_DENOMS, {value: response.data})
      if (subscribe) {
        commit('SUBSCRIBE', { action: DemerisActionTypes.GET_VERIFIED_DENOMS, payload: {} })
      }
    }catch(e) {
      throw new SpVuexError(
        'Demeris:GetVerifiedDenoms',
        'Could not perform API query.'
      )
    }
    return getters['getVerifiedDenoms'];
  },
  async [DemerisActionTypes.GET_PRIMARY_CHANNEL]({ commit, getters }, { subscribe = false, params }) {
    
		try {
      // TODO: Correct API endpoint params
      const response =  await axios.get('/primary_channel/'+(params as API.PrimaryChannelReq).source_chain_id);
      commit(DemerisMutationTypes.SET_PRIMARY_CHANNEL,{params, value: response.data});
      if (subscribe) {
        commit('SUBSCRIBE', { action: DemerisActionTypes.GET_PRIMARY_CHANNEL, payload: {params} })
      }
    }catch(e) {
      throw new SpVuexError(
        'Demeris:GetPrimaryChannel',
        'Could not perform API query.'
      )
    }
    return getters['getPrimaryChannel'](JSON.stringify(params));
  },
  async [DemerisActionTypes.GET_CHAIN_STATUS]({ commit, getters }, { subscribe = false, params }) {
        
		try {
      // TODO: Correct API endpoint params
      const response =  await axios.get('/chain_status/'+(params as API.ChainStatusReq).chain_id);
      commit(DemerisMutationTypes.SET_CHAIN_STATUS,{params, value: response.data});
      if (subscribe) {
        commit('SUBSCRIBE', { action: DemerisActionTypes.GET_CHAIN_STATUS, payload: {params} })
      }
    }catch(e) {
      throw new SpVuexError(
        'Demeris:GetChainStatus',
        'Could not perform API query.'
      )
    }
    return getters['getChainStatus'](JSON.stringify(params));
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
