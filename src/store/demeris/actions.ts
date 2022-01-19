import { Secp256k1HdWallet } from '@cosmjs/amino';
import { stringToPath } from '@cosmjs/crypto';
import { EncodeObject, Registry } from '@cosmjs/proto-signing';
import { SpVuexError } from '@starport/vuex';
import axios from 'axios';
import { ActionContext, ActionTree } from 'vuex';

import usePool from '@/composables/usePool';
import { RootState } from '@/store';
import { GasPriceLevel, Pool } from '@/types/actions';
import * as API from '@/types/api';
import { Amount } from '@/types/base';
import { validPools } from '@/utils/actionHandler';
import { event } from '@/utils/analytics';
import { fromHexString, hashObject, keyHashfromAddress } from '@/utils/basic';
import { addChain } from '@/utils/keplr';

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
  GlobalDemerisActionTypes,
} from './action-types';
import DemerisSigningClient from './demerisSigningClient';
import { demoAccount } from './demo-account';
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
  [DemerisActionTypes.REDEEM_GET_HAS_SEEN]({ commit, getters }: ActionContext<State, RootState>): Promise<boolean>;
  [DemerisActionTypes.REDEEM_SET_HAS_SEEN](
    { commit, getters }: ActionContext<State, RootState>,
    seen: boolean,
  ): Promise<void>;
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
  ): Promise<string>;
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

  [DemerisActionTypes.SET_SESSION_DATA](
    { commit, getters, state }: ActionContext<State, RootState>,
    { data: UserData }: DemerisSessionParams,
  ): Promise<void>;
  [DemerisActionTypes.LOAD_SESSION_DATA](
    { commit, getters }: ActionContext<State, RootState>,
    { walletName, isDemoAccount }: { walletName: string; isDemoAccount: boolean },
  ): Promise<void>;
  // Chain-specific endpoint actions
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

  [DemerisActionTypes.BROADCAST_TX](
    { commit, getters }: ActionContext<State, RootState>,
    { tx, chain_name }: DemerisTxParams,
  ): Promise<TicketResponse>;

  [DemerisActionTypes.GET_END_BLOCK_EVENTS](
    { commit, getters }: ActionContext<State, RootState>,
    { height }: DemerisTxResultParams,
  ): Promise<unknown>;

  [DemerisActionTypes.SIGN_WITH_KEPLR](
    { commit, getters }: ActionContext<State, RootState>,
    { msgs, chain_name }: DemerisSignParams,
  ): Promise<DemerisTxParams>;
  [DemerisActionTypes.SIGN_IN]({ commit, getters, dispatch }: ActionContext<State, RootState>): Promise<boolean>;
  [DemerisActionTypes.SIGN_IN_WITH_WATCHER]({
    commit,
    getters,
    dispatch,
  }: ActionContext<State, RootState>): Promise<boolean>;
  // Internal module actions
  [DemerisActionTypes.SET_GAS_LIMIT](
    { commit }: ActionContext<State, RootState>,
    { gasLimit }: { gasLimit: number },
  ): Promise<void>;
  [DemerisActionTypes.INIT](
    { commit, dispatch }: ActionContext<State, RootState>,
    { endpoint, refreshTime, hub_chain, gas_limit }: DemerisConfig,
  ): void;
  [DemerisActionTypes.SIGN_OUT]({ commit }: ActionContext<State, RootState>): void;
  [DemerisActionTypes.RESET_STATE]({ commit }: ActionContext<State, RootState>): void;
  [DemerisActionTypes.UNSUBSCRIBE](
    { commit }: ActionContext<State, RootState>,
    subscription: DemerisSubscriptions,
  ): void;
  [DemerisActionTypes.STORE_UPDATE]({ state, dispatch }: ActionContext<State, RootState>): void;
}
export interface GlobalActions {
  // Cross-chain endpoint actions
  [GlobalDemerisActionTypes.GET_BALANCES](
    ...args: Parameters<Actions[DemerisActionTypes.GET_BALANCES]>
  ): ReturnType<Actions[DemerisActionTypes.GET_BALANCES]>;
  [GlobalDemerisActionTypes.GET_POOL_BALANCES](
    ...args: Parameters<Actions[DemerisActionTypes.GET_POOL_BALANCES]>
  ): ReturnType<Actions[DemerisActionTypes.GET_POOL_BALANCES]>;
  [GlobalDemerisActionTypes.REDEEM_GET_HAS_SEEN](
    ...args: Parameters<Actions[DemerisActionTypes.REDEEM_GET_HAS_SEEN]>
  ): ReturnType<Actions[DemerisActionTypes.REDEEM_GET_HAS_SEEN]>;
  [GlobalDemerisActionTypes.REDEEM_SET_HAS_SEEN](
    ...args: Parameters<Actions[DemerisActionTypes.REDEEM_SET_HAS_SEEN]>
  ): ReturnType<Actions[DemerisActionTypes.REDEEM_SET_HAS_SEEN]>;
  [GlobalDemerisActionTypes.GET_STAKING_BALANCES](
    ...args: Parameters<Actions[DemerisActionTypes.GET_STAKING_BALANCES]>
  ): ReturnType<Actions[DemerisActionTypes.GET_STAKING_BALANCES]>;
  [GlobalDemerisActionTypes.VALIDATE_POOLS](
    ...args: Parameters<Actions[DemerisActionTypes.VALIDATE_POOLS]>
  ): ReturnType<Actions[DemerisActionTypes.VALIDATE_POOLS]>;
  [GlobalDemerisActionTypes.GET_ALL_BALANCES](
    ...args: Parameters<Actions[DemerisActionTypes.GET_ALL_BALANCES]>
  ): ReturnType<Actions[DemerisActionTypes.GET_ALL_BALANCES]>;
  [GlobalDemerisActionTypes.GET_ALL_STAKING_BALANCES](
    ...args: Parameters<Actions[DemerisActionTypes.GET_ALL_STAKING_BALANCES]>
  ): ReturnType<Actions[DemerisActionTypes.GET_ALL_STAKING_BALANCES]>;
  [GlobalDemerisActionTypes.GET_NUMBERS](
    ...args: Parameters<Actions[DemerisActionTypes.GET_NUMBERS]>
  ): ReturnType<Actions[DemerisActionTypes.GET_NUMBERS]>;
  [GlobalDemerisActionTypes.GET_NUMBERS_CHAIN](
    ...args: Parameters<Actions[DemerisActionTypes.GET_NUMBERS_CHAIN]>
  ): ReturnType<Actions[DemerisActionTypes.GET_NUMBERS_CHAIN]>;
  [GlobalDemerisActionTypes.GET_ALL_NUMBERS](
    ...args: Parameters<Actions[DemerisActionTypes.GET_ALL_NUMBERS]>
  ): ReturnType<Actions[DemerisActionTypes.GET_ALL_NUMBERS]>;
  [GlobalDemerisActionTypes.GET_FEE_ADDRESSES](
    ...args: Parameters<Actions[DemerisActionTypes.GET_FEE_ADDRESSES]>
  ): ReturnType<Actions[DemerisActionTypes.GET_FEE_ADDRESSES]>;
  [GlobalDemerisActionTypes.GET_VERIFIED_DENOMS](
    ...args: Parameters<Actions[DemerisActionTypes.GET_VERIFIED_DENOMS]>
  ): ReturnType<Actions[DemerisActionTypes.GET_VERIFIED_DENOMS]>;
  [GlobalDemerisActionTypes.GET_CHAINS](
    ...args: Parameters<Actions[DemerisActionTypes.GET_CHAINS]>
  ): ReturnType<Actions[DemerisActionTypes.GET_CHAINS]>;
  [GlobalDemerisActionTypes.GET_RELAYER_STATUS](
    ...args: Parameters<Actions[DemerisActionTypes.GET_RELAYER_STATUS]>
  ): ReturnType<Actions[DemerisActionTypes.GET_RELAYER_STATUS]>;
  [GlobalDemerisActionTypes.GET_RELAYER_BALANCES](
    ...args: Parameters<Actions[DemerisActionTypes.GET_RELAYER_BALANCES]>
  ): ReturnType<Actions[DemerisActionTypes.GET_RELAYER_BALANCES]>;
  [GlobalDemerisActionTypes.GET_PRICES](
    ...args: Parameters<Actions[DemerisActionTypes.GET_PRICES]>
  ): ReturnType<Actions[DemerisActionTypes.GET_PRICES]>;
  [GlobalDemerisActionTypes.GET_TX_STATUS](
    ...args: Parameters<Actions[DemerisActionTypes.GET_TX_STATUS]>
  ): ReturnType<Actions[DemerisActionTypes.GET_TX_STATUS]>;
  [GlobalDemerisActionTypes.GET_VERIFY_TRACE](
    ...args: Parameters<Actions[DemerisActionTypes.GET_VERIFY_TRACE]>
  ): ReturnType<Actions[DemerisActionTypes.GET_VERIFY_TRACE]>;
  [GlobalDemerisActionTypes.GET_FEE_ADDRESS](
    ...args: Parameters<Actions[DemerisActionTypes.GET_FEE_ADDRESS]>
  ): ReturnType<Actions[DemerisActionTypes.GET_FEE_ADDRESS]>;
  [GlobalDemerisActionTypes.GET_BECH32_CONFIG](
    ...args: Parameters<Actions[DemerisActionTypes.GET_BECH32_CONFIG]>
  ): ReturnType<Actions[DemerisActionTypes.GET_BECH32_CONFIG]>;
  [GlobalDemerisActionTypes.GET_CHAIN](
    ...args: Parameters<Actions[DemerisActionTypes.GET_CHAIN]>
  ): ReturnType<Actions[DemerisActionTypes.GET_CHAIN]>;
  [GlobalDemerisActionTypes.GET_PRIMARY_CHANNEL](
    ...args: Parameters<Actions[DemerisActionTypes.GET_PRIMARY_CHANNEL]>
  ): ReturnType<Actions[DemerisActionTypes.GET_PRIMARY_CHANNEL]>;
  [GlobalDemerisActionTypes.GET_PRIMARY_CHANNELS](
    ...args: Parameters<Actions[DemerisActionTypes.GET_PRIMARY_CHANNELS]>
  ): ReturnType<Actions[DemerisActionTypes.GET_PRIMARY_CHANNELS]>;
  [GlobalDemerisActionTypes.GET_CHAIN_STATUS](
    ...args: Parameters<Actions[DemerisActionTypes.GET_CHAIN_STATUS]>
  ): ReturnType<Actions[DemerisActionTypes.GET_CHAIN_STATUS]>;
  [GlobalDemerisActionTypes.BROADCAST_TX](
    ...args: Parameters<Actions[DemerisActionTypes.BROADCAST_TX]>
  ): ReturnType<Actions[DemerisActionTypes.BROADCAST_TX]>;
  [GlobalDemerisActionTypes.GET_END_BLOCK_EVENTS](
    ...args: Parameters<Actions[DemerisActionTypes.GET_END_BLOCK_EVENTS]>
  ): ReturnType<Actions[DemerisActionTypes.GET_END_BLOCK_EVENTS]>;
  [GlobalDemerisActionTypes.SIGN_WITH_KEPLR](
    ...args: Parameters<Actions[DemerisActionTypes.SIGN_WITH_KEPLR]>
  ): ReturnType<Actions[DemerisActionTypes.SIGN_WITH_KEPLR]>;
  [GlobalDemerisActionTypes.SIGN_IN](
    ...args: Parameters<Actions[DemerisActionTypes.SIGN_IN]>
  ): ReturnType<Actions[DemerisActionTypes.SIGN_IN]>;
  [GlobalDemerisActionTypes.SIGN_IN_WITH_WATCHER](
    ...args: Parameters<Actions[DemerisActionTypes.SIGN_IN_WITH_WATCHER]>
  ): ReturnType<Actions[DemerisActionTypes.SIGN_IN_WITH_WATCHER]>;
  [GlobalDemerisActionTypes.SET_GAS_LIMIT](
    ...args: Parameters<Actions[DemerisActionTypes.SET_GAS_LIMIT]>
  ): ReturnType<Actions[DemerisActionTypes.SET_GAS_LIMIT]>;
  [GlobalDemerisActionTypes.SET_SESSION_DATA](
    ...args: Parameters<Actions[DemerisActionTypes.SET_SESSION_DATA]>
  ): ReturnType<Actions[DemerisActionTypes.SET_SESSION_DATA]>;
  [GlobalDemerisActionTypes.LOAD_SESSION_DATA](
    ...args: Parameters<Actions[DemerisActionTypes.LOAD_SESSION_DATA]>
  ): ReturnType<Actions[DemerisActionTypes.LOAD_SESSION_DATA]>;
  [GlobalDemerisActionTypes.INIT](
    ...args: Parameters<Actions[DemerisActionTypes.INIT]>
  ): ReturnType<Actions[DemerisActionTypes.INIT]>;
  [GlobalDemerisActionTypes.SIGN_OUT](
    ...args: Parameters<Actions[DemerisActionTypes.SIGN_OUT]>
  ): ReturnType<Actions[DemerisActionTypes.SIGN_OUT]>;
  [GlobalDemerisActionTypes.RESET_STATE](
    ...args: Parameters<Actions[DemerisActionTypes.RESET_STATE]>
  ): ReturnType<Actions[DemerisActionTypes.RESET_STATE]>;
  [GlobalDemerisActionTypes.UNSUBSCRIBE](
    ...args: Parameters<Actions[DemerisActionTypes.UNSUBSCRIBE]>
  ): ReturnType<Actions[DemerisActionTypes.UNSUBSCRIBE]>;
  [GlobalDemerisActionTypes.STORE_UPDATE](
    ...args: Parameters<Actions[DemerisActionTypes.STORE_UPDATE]>
  ): ReturnType<Actions[DemerisActionTypes.STORE_UPDATE]>;
}
//@ts-ignore
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
  async [DemerisActionTypes.GET_ALL_BALANCES]({ dispatch, getters }) {
    try {
      const keyHashes = getters['getKeyhashes'];
      for (const keyHash of keyHashes) {
        await dispatch(DemerisActionTypes.GET_BALANCES, { subscribe: true, params: { address: keyHash } });
      }
    } catch (e) {
      throw new SpVuexError('Demeris:GetAllBalances', 'Could not perform API query.');
    }
    return getters['getAllBalances'];
  },
  async [DemerisActionTypes.GET_ALL_STAKING_BALANCES]({ dispatch, getters }) {
    try {
      const keyHashes = getters['getKeyhashes'];
      for (const keyHash of keyHashes) {
        await dispatch(DemerisActionTypes.GET_STAKING_BALANCES, { subscribe: true, params: { address: keyHash } });
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
      throw new SpVuexError('Demeris:ValidatePools', 'Could not perform pool validation.');
    }
    return getters['getAllValidPools'];
  },
  async [DemerisActionTypes.REDEEM_GET_HAS_SEEN]() {
    const redeem = window.localStorage.getItem('redeem');
    return redeem === 'true' ? true : false;
  },
  async [DemerisActionTypes.REDEEM_SET_HAS_SEEN]({}, seen) {
    seen ? window.localStorage.setItem('redeem', 'true') : window.localStorage.setItem('redeem', 'false');
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
  async [DemerisActionTypes.GET_ALL_NUMBERS]({ dispatch, getters }) {
    try {
      const keyHashes = getters['getKeyhashes'];
      for (const keyHash of keyHashes) {
        await dispatch(DemerisActionTypes.GET_NUMBERS, { subscribe: true, params: { address: keyHash } });
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
  async [DemerisActionTypes.LOAD_SESSION_DATA]({ commit }, { walletName, isDemoAccount = false }) {
    const data = window.localStorage.getItem(walletName);
    if (data) {
      const newData = { ...JSON.parse(data), updateDT: Date.now() };
      window.localStorage.setItem(walletName, JSON.stringify(newData));
      commit('SET_SESSION_DATA', newData);
    } else {
      const newData = {
        customSlippage: false,
        viewUnverified: false,
        viewLPAssetPools: false,
        gasPriceLevel: GasPriceLevel.AVERAGE,
        hasSeenRedeem: false,
        slippagePerc: 0.1,
        updateDT: Date.now(),
        isDemoAccount,
      };
      window.localStorage.setItem(walletName, JSON.stringify(newData));
      commit('SET_SESSION_DATA', newData);
    }
    commit('SUBSCRIBE', { action: DemerisActionTypes.SET_SESSION_DATA, payload: { data: null } });
  },
  async [DemerisActionTypes.SET_SESSION_DATA]({ commit, getters, state }, { data }: DemerisSessionParams) {
    if (data) {
      window.localStorage.setItem(
        getters['getKeplrAccountName'],
        JSON.stringify({ ...state._Session, ...data, updateDT: Date.now() }),
      );
      commit('SET_SESSION_DATA', { ...data, updateDT: Date.now() });
    } else {
      window.localStorage.setItem(
        getters['getKeplrAccountName'],
        JSON.stringify({ ...state._Session, updateDT: Date.now() }),
      );
      commit('SET_SESSION_DATA', { updateDT: Date.now() });
    }
  },
  async [DemerisActionTypes.SIGN_WITH_KEPLR]({ getters, dispatch }, { msgs, chain_name, fee, registry, memo }) {
    try {
      const isCypress = !!window['Cypress'];
      let chain = getters['getChain']({
        chain_name,
      }) as ChainData;
      if (!chain || !chain.node_info) {
        chain = await dispatch(DemerisActionTypes.GET_CHAIN, {
          subscribe: true,
          params: {
            chain_name,
          },
        });
      }
      // await addChain(chain_name);

      if (!isCypress) {
        await window.keplr.enable(chain.node_info.chain_id);
      }
      const offlineSigner = isCypress
        ? await Secp256k1HdWallet.fromMnemonic(process.env.VUE_APP_EMERIS_MNEMONIC, {
            prefix: chain.node_info.bech32_config.main_prefix,
            hdPaths: [stringToPath(chain.derivation_path)],
          })
        : await window.getOfflineSigner(chain.node_info.chain_id);
      const [account] = await offlineSigner.getAccounts();

      const client = new DemerisSigningClient(undefined, offlineSigner, { registry });

      const numbers = await dispatch(DemerisActionTypes.GET_NUMBERS_CHAIN, {
        subscribe: false,
        params: {
          address: keyHashfromAddress(account.address),
          chain_name: chain_name,
        },
      });

      const signerData = numbers;
      const cosmjsSignerData = {
        chainId: chain.node_info.chain_id,
        accountNumber: parseInt(signerData.account_number),
        sequence: parseInt(signerData.sequence_number),
      };
      const tx = await (client as DemerisSigningClient).signWMeta(account.address, msgs, fee, memo, cosmjsSignerData);

      const tx_data = Buffer.from(tx).toString('base64');
      //console.log(Buffer.from(tx).toString('hex'));
      return { tx: tx_data, chain_name, address: account.address };
    } catch (e) {
      console.error(e);
      throw new SpVuexError('Demeris:SignWithKeplr', 'Could not sign TX.');
    }
  },

  async [DemerisActionTypes.SIGN_IN]({ commit, getters, dispatch }) {
    try {
      await dispatch(DemerisActionTypes.SIGN_OUT);
      const isCypress = !!window['Cypress'];
      const chains = getters['getChains'];
      window.keplr.defaultOptions = { sign: { preferNoSetFee: true, preferNoSetMemo: true } };
      for (const chain in chains) {
        await addChain(chain);
      }
      if (!isCypress) {
        await window.keplr['enable']((Object.values(chains) as Array<ChainData>).map((x) => x.node_info.chain_id));
      }
      const paths = new Set();
      const toQuery = [];
      for (const chain_name in chains) {
        const chain = chains[chain_name];
        if (paths.has(chain.derivation_path)) {
          continue;
        }
        paths.add(chain.derivation_path);
        toQuery.push(chain);
      }
      const dexchain = getters['getChain']({ chain_name: getters['getDexChain'] });
      let keyData;
      let signer;
      if (!isCypress) {
        await window.keplr.enable(dexchain.node_info.chain_id);
        keyData = await window.keplr.getKey(dexchain.node_info.chain_id);
      } else {
        signer = await Secp256k1HdWallet.fromMnemonic(process.env.VUE_APP_EMERIS_MNEMONIC, {
          prefix: dexchain.node_info.bech32_config.main_prefix,
          hdPaths: [stringToPath(dexchain.derivation_path)],
        });
        const [account] = await signer.getAccounts();
        keyData = {
          name: 'Cypress Test',
          algo: account.algo,
          pubKey: account.pubkey,
          bech32Address: account.address,
          isNanoLedger: false,
          address: fromHexString(keyHashfromAddress(account.address)),
        };
      }

      commit(DemerisMutationTypes.SET_KEPLR, keyData);
      event('sign_in', { event_label: 'Sign in with Keplr', event_category: 'authentication' });
      await dispatch(DemerisActionTypes.LOAD_SESSION_DATA, { walletName: keyData.name, isDemoAccount: false });
      for (const chain of toQuery) {
        if (!isCypress) {
          await window.keplr.enable(chain.node_info.chain_id);
          const otherKey = await window.keplr.getKey(chain.node_info.chain_id);
          commit(DemerisMutationTypes.ADD_KEPLR_KEYHASH, keyHashfromAddress(otherKey.bech32Address));
        } else {
          const signer = await Secp256k1HdWallet.fromMnemonic(process.env.VUE_APP_EMERIS_MNEMONIC, {
            prefix: chain.node_info.bech32_config.main_prefix,
            hdPaths: [stringToPath(chain.derivation_path)],
          });
          const [account] = await signer.getAccounts();
          const otherKey = {
            name: 'Cypress Test',
            algo: account.algo,
            pubKey: account.pubkey,
            bech32Address: account.address,
            isNanoLedger: false,
            address: fromHexString(keyHashfromAddress(account.address)),
          };
          commit(DemerisMutationTypes.ADD_KEPLR_KEYHASH, keyHashfromAddress(otherKey.bech32Address));
        }
      }
      isCypress
        ? dispatch('common/wallet/signIn', { keplr: await window.getOfflineSigner('cosmoshub-4') }, { root: true })
        : dispatch('common/wallet/signIn', { keplr: signer }, { root: true });

      dispatch(DemerisActionTypes.GET_ALL_BALANCES, { subscribe: true });
      dispatch(DemerisActionTypes.GET_ALL_STAKING_BALANCES, {
        subscribe: true,
      });
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  },

  async [DemerisActionTypes.SIGN_IN_WITH_WATCHER]({ commit, dispatch }) {
    try {
      await dispatch(DemerisActionTypes.SIGN_OUT);
      const key = demoAccount;
      commit(DemerisMutationTypes.SET_KEPLR, { ...key });
      for (const hash of key.keyHashes) {
        commit(DemerisMutationTypes.ADD_KEPLR_KEYHASH, hash);
      }
      await dispatch(DemerisActionTypes.LOAD_SESSION_DATA, { walletName: key.name, isDemoAccount: true });
      dispatch('common/wallet/signIn', { keplr: null }, { root: true });
      event('sign_in_demo', { event_label: 'Sign in with Demo Account', event_category: 'authentication' });
      dispatch(DemerisActionTypes.GET_ALL_BALANCES, { subscribe: true });
      dispatch(DemerisActionTypes.GET_ALL_STAKING_BALANCES, {
        subscribe: true,
      });
      return true;
    } catch (e) {
      return false;
    }
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
                } catch (e) {}
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
    return 'pending';
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

  async [DemerisActionTypes.BROADCAST_TX]({ getters }, { tx, chain_name, address }: DemerisTxParams) {
    try {
      const response = await axios.post(getters['getEndpoint'] + '/tx/' + chain_name, { tx_bytes: tx, address });
      return response.data;
    } catch (e) {
      const cause = e.response?.data?.cause || e.message;
      throw new SpVuexError('Demeris:BroadcastTx', 'Could not broadcastTx.' + cause);
    }
  },
  async [DemerisActionTypes.SET_GAS_LIMIT]({ commit }, { gasLimit }: { gasLimit: number }) {
    try {
      commit('SET_GAS_LIMIT', { value: gasLimit });
    } catch (e) {
      throw new SpVuexError('Demeris:SetGasLimit', 'Could not set Gas Limit');
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
      while (Date.now() < wakeUpTime) {}
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
    setInterval(() => {
      dispatch(DemerisActionTypes.STORE_UPDATE);
    }, refreshTime);
  },
  [DemerisActionTypes.RESET_STATE]({ commit }) {
    commit(DemerisMutationTypes.RESET_STATE);
  },
  [DemerisActionTypes.SIGN_OUT]({ commit }) {
    event('sign_out', { event_label: 'Signed out', event_category: 'authentication' });
    commit(DemerisMutationTypes.SIGN_OUT);
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