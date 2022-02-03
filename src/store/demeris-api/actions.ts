import { EncodeObject, Registry } from '@cosmjs/proto-signing';
import { SpVuexError } from '@starport/vuex';
import axios from 'axios';
import { ActionContext, ActionTree } from 'vuex';

import usePool from '@/composables/usePool';
import { GlobalDemerisGetterTypes, RootState } from '@/store';
import { Pool } from '@/types/actions';
import * as API from '@/types/api';
import { Amount } from '@/types/base';
import { validPools } from '@/utils/actionHandler';
import { hashObject } from '@/utils/basic';
import { featureRunning } from '@/utils/FeatureManager';

import {
  DemerisActionParams,
  DemerisActionsByAddressParams,
  DemerisActionsByChainAddressParams,
  DemerisActionsByChainParams,
  DemerisActionsByTicketParams,
  DemerisActionsGetTxsParams,
  DemerisActionsTraceParams,
  DemerisActionTypes,
  DemerisSubscriptions,
} from './action-types';
import { DemerisMutationTypes, UserData } from './mutation-types';
import { ChainData, State } from './state';

export type DemerisConfig = {
  endpoint: string;
  refreshTime?: number;
  hub_chain?: string;
  gas_limit?: number;
};
export type DemerisTxParams = {
  tx: string;
  chain_name: string;
  address: string;
};
export type DemerisTxResultParams = {
  height: number;
  stepType: string;
};
export type GasFee = {
  amount: Array<Amount>;
  gas: string;
};

export type DemerisSignParams = {
  msgs: Array<EncodeObject>;
  chain_name: string;
  fee: GasFee;
  registry: Registry;
  memo?: string;
};
export type DemerisSessionParams = {
  data: UserData;
};
export type TicketResponse = {
  ticket: string;
};

type Namespaced<T, N extends string> = {
  [P in keyof T & string as `${N}/${P}`]: T[P];
};
export interface Actions {
  // Cross-chain endpoint actions
  [DemerisActionTypes.GET_BALANCES](
    { commit, getters }: ActionContext<State, RootState>,
    { subscribe, params }: DemerisActionsByAddressParams,
  ): Promise<API.Balances>;
  [DemerisActionTypes.GET_POOL_BALANCES](
    { commit, getters }: ActionContext<State, RootState>,
    { subscribe, params }: DemerisActionsByAddressParams,
  ): Promise<API.Balances>;
  [DemerisActionTypes.GET_STAKING_BALANCES](
    { commit, getters }: ActionContext<State, RootState>,
    { subscribe, params }: DemerisActionsByAddressParams,
  ): Promise<API.StakingBalances>;
  [DemerisActionTypes.GET_ALL_BALANCES]({ dispatch, getters }: ActionContext<State, RootState>): Promise<API.Balances>;
  [DemerisActionTypes.GET_ALL_STAKING_BALANCES]({
    dispatch,
    getters,
  }: ActionContext<State, RootState>): Promise<API.StakingBalances>;
  [DemerisActionTypes.GET_NUMBERS](
    { commit, getters }: ActionContext<State, RootState>,
    { subscribe, params }: DemerisActionsByAddressParams,
  ): Promise<API.Numbers>;
  [DemerisActionTypes.VALIDATE_POOLS](
    { commit, getters }: ActionContext<State, RootState>,
    pools: Pool[],
  ): Promise<Pool[]>;
  [DemerisActionTypes.GET_NUMBERS_CHAIN](
    { commit, getters }: ActionContext<State, RootState>,
    { subscribe, params }: DemerisActionsByChainAddressParams,
  ): Promise<API.SeqNumber>;
  [DemerisActionTypes.GET_ALL_NUMBERS]({ dispatch, getters }: ActionContext<State, RootState>): Promise<API.Numbers>;
  [DemerisActionTypes.GET_VERIFIED_DENOMS](
    { commit, getters }: ActionContext<State, RootState>,
    { subscribe }: DemerisActionsByAddressParams,
  ): Promise<API.VerifiedDenoms>;
  [DemerisActionTypes.GET_TX_STATUS](
    { commit, getters }: ActionContext<State, RootState>,
    { subscribe }: DemerisActionsByTicketParams,
  ): Promise<API.Ticket>;
  [DemerisActionTypes.GET_FEE_ADDRESSES](
    { commit, getters }: ActionContext<State, RootState>,
    { subscribe }: DemerisActionParams,
  ): Promise<API.FeeAddresses>;
  [DemerisActionTypes.GET_CHAINS](
    { commit, getters }: ActionContext<State, RootState>,
    { subscribe }: DemerisActionParams,
  ): Promise<Record<string, ChainData>>;
  [DemerisActionTypes.GET_RELAYER_STATUS](
    { commit, getters }: ActionContext<State, RootState>,
    { subscribe }: DemerisActionParams,
  ): Promise<boolean>;
  [DemerisActionTypes.GET_RELAYER_BALANCES](
    { commit, getters }: ActionContext<State, RootState>,
    { subscribe }: DemerisActionParams,
  ): Promise<API.RelayerBalances>;
  [DemerisActionTypes.GET_PRICES](
    { commit, getters }: ActionContext<State, RootState>,
    { subscribe }: DemerisActionParams,
  ): Promise<API.Prices>;
  [DemerisActionTypes.GET_VERIFY_TRACE](
    { commit, getters, state }: ActionContext<State, RootState>,
    { subscribe, params }: DemerisActionsTraceParams,
  ): Promise<API.VerifyTrace>;
  [DemerisActionTypes.GET_FEE_ADDRESS](
    { commit, getters }: ActionContext<State, RootState>,
    { subscribe, params }: DemerisActionsByChainParams,
  ): Promise<API.FeeAddress>;
  [DemerisActionTypes.GET_BECH32_CONFIG](
    { commit, getters }: ActionContext<State, RootState>,
    { subscribe, params }: DemerisActionsByChainParams,
  ): Promise<API.Bech32Config>;
  [DemerisActionTypes.GET_CHAIN](
    { commit, getters }: ActionContext<State, RootState>,
    { subscribe }: DemerisActionsByChainParams,
  ): Promise<API.Chain>;
  [DemerisActionTypes.GET_PRIMARY_CHANNEL](
    { commit, getters }: ActionContext<State, RootState>,
    { subscribe, params }: DemerisActionsByChainParams,
  ): Promise<API.PrimaryChannel>;
  [DemerisActionTypes.GET_PRIMARY_CHANNELS](
    { commit, getters }: ActionContext<State, RootState>,
    { subscribe, params }: DemerisActionsByChainParams,
  ): Promise<API.PrimaryChannels>;
  [DemerisActionTypes.GET_CHAIN_STATUS](
    { commit, getters }: ActionContext<State, RootState>,
    { subscribe, params }: DemerisActionsByChainParams,
  ): Promise<boolean>;
  [DemerisActionTypes.GET_END_BLOCK_EVENTS](
    { commit, getters }: ActionContext<State, RootState>,
    { height }: DemerisTxResultParams,
  ): Promise<unknown>;

  [DemerisActionTypes.INIT](
    { commit, dispatch }: ActionContext<State, RootState>,
    { endpoint, refreshTime, hub_chain, gas_limit }: DemerisConfig,
  ): void;
  [DemerisActionTypes.RESET_STATE]({ commit }: ActionContext<State, RootState>): void;
  [DemerisActionTypes.SIGN_OUT]({ commit }: ActionContext<State, RootState>, keyHashes: string[]): void;
  [DemerisActionTypes.UNSUBSCRIBE](
    { commit }: ActionContext<State, RootState>,
    subscription: DemerisSubscriptions,
  ): void;
  [DemerisActionTypes.STORE_UPDATE]({ state, dispatch }: ActionContext<State, RootState>): void;
}

export type GlobalActions = Namespaced<Actions, 'demerisAPI'>;

export const actions: ActionTree<State, RootState> & Actions = {
  // Cross-chain endpoint actions

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async [DemerisActionTypes.GET_BALANCES]({ commit, getters, state }, { subscribe = false, params }) {
    const reqHash = hashObject({ action: DemerisActionTypes.GET_BALANCES, payload: { params } });

    if (state._InProgess.get(reqHash)) {
      await state._InProgess.get(reqHash);

      return getters['getBalances'](params);
    } else {
      let resolver;
      let rejecter;
      const promise = new Promise((resolve, reject) => {
        resolver = resolve;
        rejecter = reject;
      });
      commit(DemerisMutationTypes.SET_IN_PROGRESS, { hash: reqHash, promise });
      try {
        const response = await axios.get(
          getters['getEndpoint'] + '/account/' + (params as API.AddrReq).address + '/balance',
        );

        commit(DemerisMutationTypes.SET_BALANCES, { params, value: response.data.balances });
        if (subscribe) {
          commit('SUBSCRIBE', { action: DemerisActionTypes.GET_BALANCES, payload: { params } });
        }
      } catch (e) {
        commit(DemerisMutationTypes.DELETE_IN_PROGRESS, reqHash);
        rejecter(e);
        if (subscribe) {
          commit('SUBSCRIBE', { action: DemerisActionTypes.GET_BALANCES, payload: { params } });
        }
        throw new SpVuexError('Demeris:GetBalances', 'Could not perform API query.');
      }
      commit(DemerisMutationTypes.DELETE_IN_PROGRESS, reqHash);
      resolver();

      return getters['getBalances'](params);
    }
  },
  async [DemerisActionTypes.GET_POOL_BALANCES]({ commit, getters, state }, { subscribe = false, params }) {
    const reqHash = hashObject({ action: DemerisActionTypes.GET_POOL_BALANCES, payload: { params } });

    if (state._InProgess.get(reqHash)) {
      await state._InProgess.get(reqHash);

      return getters['getBalances'](params);
    } else {
      let resolver;
      let rejecter;
      const promise = new Promise((resolve, reject) => {
        resolver = resolve;
        rejecter = reject;
      });
      commit(DemerisMutationTypes.SET_IN_PROGRESS, { hash: reqHash, promise });
      try {
        const response = await axios.get(
          getters['getEndpoint'] + '/account/' + (params as API.AddrReq).address + '/balance',
        );

        commit(DemerisMutationTypes.SET_POOL_BALANCES, { params, value: response.data.balances });
        if (subscribe) {
          commit('SUBSCRIBE', { action: DemerisActionTypes.GET_POOL_BALANCES, payload: { params } });
        }
      } catch (e) {
        commit(DemerisMutationTypes.DELETE_IN_PROGRESS, reqHash);
        rejecter(e);
        if (subscribe) {
          commit('SUBSCRIBE', { action: DemerisActionTypes.GET_POOL_BALANCES, payload: { params } });
        }
        throw new SpVuexError('Demeris:GetBalances', 'Could not perform API query.');
      }
      commit(DemerisMutationTypes.DELETE_IN_PROGRESS, reqHash);
      resolver();

      return getters['getBalances'](params);
    }
  },
  async [DemerisActionTypes.GET_ALL_BALANCES]({ dispatch, getters, rootGetters }) {
    try {
      const keyHashes = rootGetters[GlobalDemerisGetterTypes.USER.getKeyhashes];

      for (const keyHash of keyHashes) {
        dispatch(DemerisActionTypes.GET_BALANCES, { subscribe: true, params: { address: keyHash } });
      }
    } catch (e) {
      throw new SpVuexError('Demeris:GetAllBalances', 'Could not perform API query.');
    }
    return getters['getAllBalances'];
  },
  async [DemerisActionTypes.GET_ALL_STAKING_BALANCES]({ dispatch, getters, rootGetters }) {
    try {
      const keyHashes = rootGetters[GlobalDemerisGetterTypes.USER.getKeyhashes];
      for (const keyHash of keyHashes) {
        dispatch(DemerisActionTypes.GET_STAKING_BALANCES, { subscribe: true, params: { address: keyHash } });
      }
    } catch (e) {
      throw new SpVuexError('Demeris:GetAllStakingBalances', 'Could not perform API query.');
    }
    return getters['getAllStakingBalances'];
  },
  async [DemerisActionTypes.VALIDATE_POOLS]({ commit, getters }, pools) {
    try {
      const vp = await validPools(pools);
      commit('SET_VALID_POOLS', vp);
    } catch (e) {
      console.log(e);
      throw new SpVuexError('Demeris:ValidatePools', 'Could not perform pool validation.');
    }
    return getters['getAllValidPools'];
  },
  async [DemerisActionTypes.GET_STAKING_BALANCES]({ commit, getters, state }, { subscribe = false, params }) {
    const reqHash = hashObject({ action: DemerisActionTypes.GET_STAKING_BALANCES, payload: { params } });

    if (state._InProgess.get(reqHash)) {
      await state._InProgess.get(reqHash);

      return getters['getStakingBalances'](params);
    } else {
      let resolver;
      let rejecter;
      const promise = new Promise((resolve, reject) => {
        resolver = resolve;
        rejecter = reject;
      });
      commit(DemerisMutationTypes.SET_IN_PROGRESS, { hash: reqHash, promise });
      try {
        const response = await axios.get(
          getters['getEndpoint'] + '/account/' + (params as API.AddrReq).address + '/stakingbalances',
        );
        commit(DemerisMutationTypes.SET_STAKING_BALANCES, { params, value: response.data.staking_balances });
        if (subscribe) {
          commit('SUBSCRIBE', { action: DemerisActionTypes.GET_STAKING_BALANCES, payload: { params } });
        }
      } catch (e) {
        commit(DemerisMutationTypes.DELETE_IN_PROGRESS, reqHash);
        rejecter(e);
        if (subscribe) {
          commit('SUBSCRIBE', { action: DemerisActionTypes.GET_STAKING_BALANCES, payload: { params } });
        }
        throw new SpVuexError('Demeris:GetStakingBalances', 'Could not perform API query.');
      }
      commit(DemerisMutationTypes.DELETE_IN_PROGRESS, reqHash);
      resolver();

      return getters['getStakingBalances'](params);
    }
  },
  async [DemerisActionTypes.GET_NUMBERS]({ commit, getters }, { subscribe = false, params }) {
    try {
      const response = await axios.get(
        getters['getEndpoint'] + '/account/' + (params as API.AddrReq).address + '/numbers',
      );
      commit(DemerisMutationTypes.SET_NUMBERS, { params, value: response.data.numbers });
      if (subscribe) {
        commit('SUBSCRIBE', { action: DemerisActionTypes.GET_NUMBERS, payload: { params } });
      }
    } catch (e) {
      throw new SpVuexError('Demeris:GetNumbers', 'Could not perform API query.');
    }
    return getters['getNumbers'](params);
  },
  async [DemerisActionTypes.GET_NUMBERS_CHAIN]({ commit, getters }, { subscribe = false, params }) {
    try {
      const response = await axios.get(
        getters['getEndpoint'] +
        '/chain/' +
        (params as API.ChainAddrReq).chain_name +
        '/numbers/' +
        (params as API.ChainAddrReq).address,
      );
      commit(DemerisMutationTypes.SET_NUMBERS_CHAIN, { params, value: response.data.numbers });
      if (subscribe) {
        commit('SUBSCRIBE', { action: DemerisActionTypes.GET_NUMBERS_CHAIN, payload: { params } });
      }
    } catch (e) {
      throw new SpVuexError('Demeris:GetNumbersChain', 'Could not perform API query.');
    }
    return getters['getNumbersChain'](params);
  },
  async [DemerisActionTypes.GET_ALL_NUMBERS]({ dispatch, getters, rootGetters }) {
    try {
      const keyHashes = rootGetters[GlobalDemerisGetterTypes.USER.getKeyhashes];
      for (const keyHash of keyHashes) {
        if (featureRunning('REQUEST_PARALLELIZATION')) {
          dispatch(DemerisActionTypes.GET_NUMBERS, { subscribe: true, params: { address: keyHash } });
        } else {
          await dispatch(DemerisActionTypes.GET_NUMBERS, { subscribe: true, params: { address: keyHash } });
        }
      }
    } catch (e) {
      throw new SpVuexError('Demeris:GetAllNumbers', 'Could not perform API query.');
    }
    return getters['getAllNumbers'];
  },
  async [DemerisActionTypes.GET_VERIFIED_DENOMS]({ commit, getters }, { subscribe = false }) {
    try {
      const response = await axios.get(getters['getEndpoint'] + '/verified_denoms');
      commit(DemerisMutationTypes.SET_VERIFIED_DENOMS, { value: response.data.verified_denoms });
      if (subscribe) {
        commit('SUBSCRIBE', { action: DemerisActionTypes.GET_VERIFIED_DENOMS, payload: {} });
      }
    } catch (e) {
      throw new SpVuexError('Demeris:GetVerifiedDenoms', 'Could not perform API query.');
    }
    return getters['getVerifiedDenoms'];
  },
  async [DemerisActionTypes.GET_FEE_ADDRESSES]({ commit, getters }, { subscribe = false, params }) {
    try {
      const response = await axios.get(getters['getEndpoint'] + '/chains/fee/addresses');
      commit(DemerisMutationTypes.SET_FEE_ADDRESSES, { params, value: response.data.fee_addresses });
      if (subscribe) {
        commit('SUBSCRIBE', { action: DemerisActionTypes.GET_FEE_ADDRESSES, payload: { params } });
      }
    } catch (e) {
      throw new SpVuexError('Demeris:GetFeeAddresses', 'Could not perform API query.');
    }
    return getters['getFeeAddresses'](JSON.stringify(params));
  },
  async [DemerisActionTypes.GET_PRICES]({ commit, getters, rootGetters, state }, { subscribe = false }) {
    const reqHash = hashObject({ action: DemerisActionTypes.GET_PRICES, payload: {} });

    if (state._InProgess.get(reqHash)) {
      await state._InProgess.get(reqHash);

      return getters['getPrices'];
    } else {
      let resolver;
      let rejecter;
      const promise = new Promise((resolve, reject) => {
        resolver = resolve;
        rejecter = reject;
      });
      commit(DemerisMutationTypes.SET_IN_PROGRESS, { hash: reqHash, promise });
      try {
        const response = await axios.get(getters['getEndpoint'] + '/oracle/prices');
        for (const denom of getters['getVerifiedDenoms']) {
          if (denom.name.startsWith('pool')) {
            const pools = rootGetters['tendermint.liquidity.v1beta1/getLiquidityPools']().pools;
            if (pools) {
              const pool = pools.find((pool) => pool.pool_coin_denom == denom.name);
              if (pool) {
                const { totalLiquidityPrice, totalSupply, initPromise } = usePool(pool.id);
                await initPromise;
                try {
                  if (totalLiquidityPrice.value > 0) {
                    const priceData = {
                      Symbol: denom.ticker + 'USDT',
                      Price: (totalLiquidityPrice.value * 10 ** 6) / totalSupply.value,
                      Supply: totalSupply.value,
                    };
                    response.data.data.Tokens.push(priceData);
                  }
                } catch (e) { }
              }
            }
          }
        }
        if (response.data?.data?.Tokens) {
          commit(DemerisMutationTypes.SET_PRICES, { value: response.data.data });
        }
        if (subscribe) {
          commit('SUBSCRIBE', { action: DemerisActionTypes.GET_PRICES, payload: {} });
        }
      } catch (e) {
        commit(DemerisMutationTypes.DELETE_IN_PROGRESS, reqHash);
        rejecter(e);
        if (subscribe) {
          commit('SUBSCRIBE', { action: DemerisActionTypes.GET_PRICES, payload: {} });
        }
        throw new SpVuexError('Demeris:GetPrices', 'Could not perform API query.');
      }
      commit(DemerisMutationTypes.DELETE_IN_PROGRESS, reqHash);
      resolver();
      return getters['getPrices'];
    }
  },
  async [DemerisActionTypes.GET_TX_STATUS]({ commit, getters }, { subscribe = false, params }) {
    try {
      const response = await axios.get(
        getters['getEndpoint'] +
        '/tx/ticket/' +
        (params as API.TicketReq).chain_name +
        '/' +
        (params as API.TicketReq).ticket,
      );
      commit(DemerisMutationTypes.SET_TX_STATUS, { params, value: response.data });
      if (subscribe) {
        commit('SUBSCRIBE', { action: DemerisActionTypes.GET_TX_STATUS, payload: { params } });
      }
    } catch (e) {
      console.error(e);
      throw new SpVuexError('Demeris:GetTXStatus', 'Could not perform API query.');
    }
    return getters['getTxStatus'](params);
  },
  async [DemerisActionTypes.GET_CHAINS]({ commit, getters }, { subscribe = false }) {
    try {
      const response = await axios.get(getters['getEndpoint'] + '/chains');
      commit(DemerisMutationTypes.SET_CHAINS, { value: response.data.chains });
      if (subscribe) {
        commit('SUBSCRIBE', { action: DemerisActionTypes.GET_CHAINS, payload: {} });
      }
    } catch (e) {
      throw new SpVuexError('Demeris:GetChains', 'Could not perform API query.');
    }
    return getters['getChains'];
  },

  async [DemerisActionTypes.GET_RELAYER_STATUS]({ commit, getters }, { subscribe = false }) {
    try {
      const response = await axios.get(getters['getEndpoint'] + '/relayer/status');
      commit(DemerisMutationTypes.SET_RELAYER_STATUS, { value: response.data.running });
      if (subscribe) {
        commit('SUBSCRIBE', { action: DemerisActionTypes.GET_RELAYER_STATUS, payload: {} });
      }
    } catch (e) {
      throw new SpVuexError('Demeris:getRelayerStatus', 'Could not perform API query.');
    }
    return getters['getRelayerStatus'];
  },
  async [DemerisActionTypes.GET_RELAYER_BALANCES]({ commit, getters }, { subscribe = false }) {
    try {
      const response = await axios.get(getters['getEndpoint'] + '/relayer/balance');

      if (response.data.balances) {
        commit(DemerisMutationTypes.SET_RELAYER_BALANCES, { value: response.data.balances });
      }
      if (subscribe) {
        commit('SUBSCRIBE', { action: DemerisActionTypes.GET_RELAYER_BALANCES, payload: {} });
      }
      return response.data.balances;
    } catch (e) {
      throw new SpVuexError('Demeris:getRelayerBalances', 'Could not perform API query.');
    }
  },
  // Chain-specific endpoint actions

  async [DemerisActionTypes.GET_VERIFY_TRACE]({ commit, getters, state }, { subscribe = false, cache = true, params }) {
    const reqHash = hashObject({ action: DemerisActionTypes.GET_VERIFY_TRACE, payload: { params } });
    if (state._InProgess.get(reqHash) && cache) {
      await state._InProgess.get(reqHash);
      return getters['getVerifyTrace'](params);
    } else {
      let resolver;
      let rejecter;
      const promise = new Promise((resolve, reject) => {
        resolver = resolve;
        rejecter = reject;
      });
      commit(DemerisMutationTypes.SET_IN_PROGRESS, { hash: reqHash, promise });
      try {
        const response = await axios.get(
          getters['getEndpoint'] +
          '/chain/' +
          (params as API.VerifyTraceReq).chain_name +
          '/denom/verify_trace/' +
          (params as API.VerifyTraceReq).hash,
        );
        if (response && response.data && response.data.verify_trace) {
          commit(DemerisMutationTypes.SET_VERIFY_TRACE, { params, value: response.data.verify_trace });
        }
        if (subscribe) {
          commit('SUBSCRIBE', { action: DemerisActionTypes.GET_VERIFY_TRACE, payload: { params } });
        }
      } catch (e) {
        commit(DemerisMutationTypes.DELETE_IN_PROGRESS, reqHash);
        rejecter(e);

        if (subscribe) {
          commit('SUBSCRIBE', { action: DemerisActionTypes.GET_VERIFY_TRACE, payload: { params } });
        }
        throw new SpVuexError('Demeris:GetVerifiedPath', 'Could not perform API query.');
      }
      resolver();
      commit(DemerisMutationTypes.DELETE_IN_PROGRESS, reqHash);
      return getters['getVerifyTrace'](params);
    }
  },
  async [DemerisActionTypes.GET_FEE_ADDRESS]({ commit, getters }, { subscribe = false, params }) {
    try {
      const response = await axios.get(
        getters['getEndpoint'] + '/chain/' + (params as API.ChainReq).chain_name + '/fee/address',
      );
      commit(DemerisMutationTypes.SET_FEE_ADDRESS, { params, value: response.data.fee_address });
      if (subscribe) {
        commit('SUBSCRIBE', { action: DemerisActionTypes.GET_FEE_ADDRESS, payload: { params } });
      }
    } catch (e) {
      throw new SpVuexError('Demeris:GetFeeAddress', 'Could not perform API query.');
    }
    return getters['getFeeAddress'](JSON.stringify(params));
  },
  async [DemerisActionTypes.GET_BECH32_CONFIG]({ commit, getters }, { subscribe = false, params }) {
    try {
      const response = await axios.get(
        getters['getEndpoint'] + '/chain/' + (params as API.ChainReq).chain_name + '/bech32',
      );
      commit(DemerisMutationTypes.SET_BECH32_CONFIG, { params, value: response.data.bech32_config });
      if (subscribe) {
        commit('SUBSCRIBE', { action: DemerisActionTypes.GET_BECH32_CONFIG, payload: { params } });
      }
    } catch (e) {
      throw new SpVuexError('Demeris:GetBech32Config', 'Could not perform API query.');
    }
    return getters['getBech32Config'](JSON.stringify(params));
  },
  async [DemerisActionTypes.GET_CHAIN]({ commit, getters, state }, { subscribe = false, params }) {
    const reqHash = hashObject({ action: DemerisActionTypes.GET_CHAIN, payload: { params } });

    if (state._InProgess.get(reqHash)) {
      await state._InProgess.get(reqHash);

      return getters['getChain'](params);
    } else {
      let resolver;
      let rejecter;
      const promise = new Promise((resolve, reject) => {
        resolver = resolve;
        rejecter = reject;
      });
      commit(DemerisMutationTypes.SET_IN_PROGRESS, { hash: reqHash, promise });
      try {
        const response = await axios.get(getters['getEndpoint'] + '/chain/' + (params as API.ChainReq).chain_name);
        commit(DemerisMutationTypes.SET_CHAIN, { params, value: response.data.chain });
        if (subscribe) {
          commit('SUBSCRIBE', { action: DemerisActionTypes.GET_CHAIN, payload: { params } });
        }
      } catch (e) {
        commit(DemerisMutationTypes.DELETE_IN_PROGRESS, reqHash);
        rejecter(e);
        if (subscribe) {
          commit('SUBSCRIBE', { action: DemerisActionTypes.GET_CHAIN, payload: { params } });
        }
        throw new SpVuexError('Demeris:GetChain', 'Could not perform API query.');
      }
      resolver();
      commit(DemerisMutationTypes.DELETE_IN_PROGRESS, reqHash);
      return getters['getChain'](params);
    }
  },
  async [DemerisActionTypes.GET_PRIMARY_CHANNEL]({ commit, getters }, { subscribe = false, params }) {
    try {
      const response = await axios.get(
        getters['getEndpoint'] +
        '/chain/' +
        (params as API.ChainReq).chain_name +
        '/primary_channel/' +
        (params as API.ChainReq).destination_chain_name,
      );
      commit(DemerisMutationTypes.SET_PRIMARY_CHANNEL, { params, value: response.data.primary_channel });
      if (subscribe) {
        commit('SUBSCRIBE', { action: DemerisActionTypes.GET_PRIMARY_CHANNEL, payload: { params } });
      }
    } catch (e) {
      throw new SpVuexError('Demeris:GetPrimaryChannel', 'Could not perform API query.');
    }
    return getters['getPrimaryChannel'](JSON.stringify(params));
  },
  async [DemerisActionTypes.GET_PRIMARY_CHANNELS]({ commit, getters }, { subscribe = false, params }) {
    try {
      const response = await axios.get(
        getters['getEndpoint'] + '/chain/' + (params as API.ChainReq).chain_name + '/primary_channels',
      );
      commit(DemerisMutationTypes.SET_PRIMARY_CHANNELS, { params, value: response.data.primary_channels });
      if (subscribe) {
        commit('SUBSCRIBE', { action: DemerisActionTypes.GET_PRIMARY_CHANNELS, payload: { params } });
      }
    } catch (e) {
      throw new SpVuexError('Demeris:GetPrimaryChannels', 'Could not perform API query.');
    }
    return getters['getPrimaryChannels'](JSON.stringify(params));
  },
  async [DemerisActionTypes.GET_CHAIN_STATUS]({ commit, getters, state }, { subscribe = false, params }) {
    const reqHash = hashObject({ action: DemerisActionTypes.GET_CHAIN_STATUS, payload: { params } });

    if (state._InProgess.get(reqHash)) {
      await state._InProgess.get(reqHash);

      return getters['getChainStatus'](params);
    } else {
      let resolver;
      let rejecter;
      const promise = new Promise((resolve, reject) => {
        resolver = resolve;
        rejecter = reject;
      });
      commit(DemerisMutationTypes.SET_IN_PROGRESS, { hash: reqHash, promise });
      try {
        const response = await axios.get(
          getters['getEndpoint'] + '/chain/' + (params as API.ChainReq).chain_name + '/status',
        );
        commit(DemerisMutationTypes.SET_CHAIN_STATUS, { params, value: response.data.online });
        if (subscribe) {
          commit('SUBSCRIBE', { action: DemerisActionTypes.GET_CHAIN_STATUS, payload: { params } });
        }
      } catch (e) {
        commit(DemerisMutationTypes.DELETE_IN_PROGRESS, reqHash);

        if (featureRunning('REQUEST_PARALLELIZATION')) {
          commit(DemerisMutationTypes.SET_CHAIN_STATUS, { params, value: false });
        }
        rejecter(e);
        if (subscribe) {
          commit('SUBSCRIBE', { action: DemerisActionTypes.GET_CHAIN_STATUS, payload: { params } });
        }
        throw new SpVuexError('Demeris:GetChainStatus', 'Could not perform API query.');
      }
      resolver();
      commit(DemerisMutationTypes.DELETE_IN_PROGRESS, reqHash);
      return getters['getChainStatus'](params);
    }
  },

  async [DemerisActionTypes.GET_TXS]({ getters }, { chain_name, txhash }: DemerisActionsGetTxsParams) {
    try {
      const response = await axios.get(getters['getEndpoint'] + '/chain/' + chain_name + '/txs/' + txhash);
      return response.data;
    } catch (e) {
      throw new SpVuexError('Demeris:GetTicketTxs', 'Could not fetch ticket transactions.' + e.message);
    }
  },

  async [DemerisActionTypes.GET_END_BLOCK_EVENTS]({ getters }, { height, stepType }: DemerisTxResultParams) {
    function sleep(ms) {
      const wakeUpTime = Date.now() + ms;
      while (Date.now() < wakeUpTime) { }
    }

    try {
      sleep(800);
      const response = await axios.get(`${getters['getEndpoint']}/block_results?height=${height}`);
      const successData = {};

      if (response.data.result?.end_block_events) {
        let isMine = false;

        const checks = getEndBlockChecks({
          type: stepType,
          requesterAddress: getters['getOwnAddress']({ chain_name: getters['getDexChain'] }),
        });

        response.data.result?.end_block_events?.forEach((item) => {
          if (item.type === checks.type) {
            item.attributes.forEach((result) => {
              const key = atob(result.key);
              const value = result.value ? atob(result.value) : null;
              successData[key] = value;
            });

            isMine = successData[checks.txAddress] === checks.requesterAddress;
          }
        });

        if (isMine) {
          return successData;
        } else {
          return null;
        }
      }

      function getEndBlockChecks(data) {
        if (data.type === 'swap') {
          return { type: 'swap_transacted', txAddress: 'swap_requester', requesterAddress: data.requesterAddress };
        }

        if (data.type === 'withdrawliquidity') {
          return { type: 'withdraw_from_pool', txAddress: 'withdrawer', requesterAddress: data.requesterAddress };
        }

        if (data.type === 'addliquidity') {
          return { type: 'deposit_to_pool', txAddress: 'depositor', requesterAddress: data.requesterAddress };
        }
      }
    } catch (e) {
      throw new SpVuexError('Demeris: GET_END_BLOCK_EVENTS', 'Could not GET_END_BLOCK_EVENTS.' + e.message);
    }
  },

  // Internal module actions

  [DemerisActionTypes.INIT](
    { commit, dispatch },
    { endpoint, hub_chain = 'cosmos-hub', refreshTime = 5000, gas_limit = 500000 },
  ) {
    console.log('Vuex nodule: demeris initialized!');
    commit('INIT', { endpoint, hub_chain, gas_limit });
    // setInterval(() => {
    //   dispatch(DemerisActionTypes.STORE_UPDATE);
    // }, refreshTime);
  },
  [DemerisActionTypes.RESET_STATE]({ commit }) {
    commit(DemerisMutationTypes.RESET_STATE);
  },
  [DemerisActionTypes.SIGN_OUT]({ commit }, keyHashes) {
    commit(DemerisMutationTypes.SIGN_OUT, keyHashes);
  },
  [DemerisActionTypes.STORE_UPDATE]({ state, dispatch }) {
    state._Subscriptions.forEach(async (subscription_json) => {
      const subscription = JSON.parse(subscription_json);
      try {
        await dispatch(subscription.action, subscription.payload);
      } catch (e) {
        console.error(e);
      }
    });
  },
  [DemerisActionTypes.UNSUBSCRIBE]({ commit }, subscription) {
    commit('UNSUBSCRIBE', subscription);
  },
};
