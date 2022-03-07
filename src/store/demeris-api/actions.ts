import { EncodeObject, Registry } from '@cosmjs/proto-signing';
import { SpVuexError } from '@starport/vuex';
import axios from 'axios';
import { ActionContext, ActionTree } from 'vuex';

import usePool from '@/composables/usePool';
import { GlobalDemerisActionTypes, GlobalDemerisGetterTypes, RootState } from '@/store';
import { Pool } from '@/types/actions';
import * as API from '@/types/api';
import { Amount } from '@/types/base';
import { validPools } from '@/utils/actionHandler';
import { getOwnAddress, hashObject, keyHashfromAddress } from '@/utils/basic';
import { featureRunning } from '@/utils/FeatureManager';
import TendermintWS from '@/utils/TendermintWS';

import {
  DemerisActionByTokenIdParams,
  DemerisActionByTokenPriceParams,
  DemerisActionGetAirdropsParams,
  DemerisActionGetGitAirdropsListParams,
  DemerisActionParams,
  DemerisActionsByAddressParams,
  DemerisActionsByChainAddressParams,
  DemerisActionsByChainParams,
  DemerisActionsByTicketParams,
  DemerisActionSetAirdropParams,
  DemerisActionsGetTxsParams,
  DemerisActionsTraceParams,
  DemerisActionTypes,
  DemerisSubscriptions,
} from './action-types';
import { DemerisMutationTypes, UserData } from './mutation-types';
import { ChainData, State } from './state';

export type DemerisConfig = {
  endpoint: string;
  wsEndpoint?: string;
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
export type DemerisGetValidatorsParam = {
  chain_name: string;
};
export type DemerisGetInflationParam = {
  chain_name: string;
};
export type DemerisGetRewardsParam = {
  chain_name: string;
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
  [DemerisActionTypes.GET_UNBONDING_DELEGATIONS](
    { commit, getters }: ActionContext<State, RootState>,
    { subscribe, params }: DemerisActionsByAddressParams,
  ): Promise<API.UnbondingDelegations>;
  [DemerisActionTypes.GET_ALL_BALANCES]({ dispatch, getters }: ActionContext<State, RootState>): Promise<API.Balances>;
  [DemerisActionTypes.GET_ALL_STAKING_BALANCES]({
    dispatch,
    getters,
  }: ActionContext<State, RootState>): Promise<API.StakingBalances>;
  [DemerisActionTypes.GET_ALL_UNBONDING_DELEGATIONS]({
    dispatch,
    getters,
  }: ActionContext<State, RootState>): Promise<API.UnbondingDelegations>;
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
  [DemerisActionTypes.GET_TOKEN_PRICES](
    { commit, getters }: ActionContext<State, RootState>,
    { subscribe, params }: DemerisActionByTokenPriceParams,
  ): Promise<any>;
  [DemerisActionTypes.RESET_TOKEN_PRICES]({ commit }: ActionContext<State, RootState>): void;
  [DemerisActionTypes.GET_GIT_AIRDROPS_LIST](
    { commit }: ActionContext<State, RootState>,
    { subscribe }: DemerisActionGetGitAirdropsListParams,
  ): Promise<any>;
  [DemerisActionTypes.GET_AIRDROPS](
    { commit, getters }: ActionContext<State, RootState>,
    { subscribe, params }: DemerisActionGetAirdropsParams,
  ): Promise<any>;
  [DemerisActionTypes.SET_SELECTED_AIRDROP](
    { commit }: ActionContext<State, RootState>,
    { params }: DemerisActionSetAirdropParams,
  ): void;
  [DemerisActionTypes.GET_TOKEN_ID](
    { commit, getters }: ActionContext<State, RootState>,
    { subscribe, params }: DemerisActionByTokenIdParams,
  ): Promise<any>;
  [DemerisActionTypes.GET_CHAIN_STATUS](
    { commit, getters }: ActionContext<State, RootState>,
    { subscribe, params }: DemerisActionsByChainParams,
  ): Promise<boolean>;
  [DemerisActionTypes.GET_END_BLOCK_EVENTS](
    { commit, getters }: ActionContext<State, RootState>,
    { height }: DemerisTxResultParams,
  ): Promise<unknown>;
  [DemerisActionTypes.GET_VALIDATORS](
    { getters }: ActionContext<State, RootState>,
    { chain_name }: DemerisGetValidatorsParam,
  ): Promise<any>;
  [DemerisActionTypes.GET_INFLATION](
    { getters }: ActionContext<State, RootState>,
    { chain_name }: DemerisGetInflationParam,
  ): Promise<unknown>;
  [DemerisActionTypes.GET_STAKING_REWARDS](
    { getters }: ActionContext<State, RootState>,
    { chain_name }: DemerisGetRewardsParam,
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
  async [DemerisActionTypes.GET_BALANCES](
    { commit, dispatch, getters, state, rootGetters },
    { subscribe = false, params },
  ) {
    axios.defaults.headers.get['X-Correlation-Id'] = rootGetters[GlobalDemerisGetterTypes.USER.getCorrelationId];
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

        if (featureRunning('REQUEST_PARALLELIZATION') && response.data.balances) {
          const tracesLoaded = [];
          for (const balance of response.data.balances as API.Balances) {
            if (
              // balance.ibc holds resolved ibc denoms so we can show the name of the coin. this functions as a cache. so if it was loaded in the past we don't need to load it again.
              Object.keys(balance.ibc).length != 0 &&
              !getters['getVerifyTrace']({
                chain_name: balance.on_chain,
                hash: balance.ibc.hash,
              })
            ) {
              tracesLoaded.push(
                dispatch(DemerisActionTypes.GET_VERIFY_TRACE, {
                  subscribe: false,
                  params: { chain_name: balance.on_chain, hash: balance.ibc.hash },
                }),
              );
            }
          }
          await Promise.all(tracesLoaded);
        }
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
  async [DemerisActionTypes.GET_POOL_BALANCES]({ commit, getters, state, rootGetters }, { subscribe = false, params }) {
    axios.defaults.headers.get['X-Correlation-Id'] = rootGetters[GlobalDemerisGetterTypes.USER.getCorrelationId];
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

      if (featureRunning('REQUEST_PARALLELIZATION')) {
        const balanceLoads = [];
        for (const keyHash of keyHashes) {
          balanceLoads.push(
            dispatch(DemerisActionTypes.GET_BALANCES, { subscribe: true, params: { address: keyHash } }),
          );
        }
        await Promise.all(balanceLoads);
        if (rootGetters[GlobalDemerisGetterTypes.USER.getBalancesFirstLoad]) {
          dispatch(GlobalDemerisActionTypes.USER.BALANCES_LOADED, null, { root: true });
        }
      } else {
        for (const keyHash of keyHashes) {
          await dispatch(DemerisActionTypes.GET_BALANCES, { subscribe: true, params: { address: keyHash } });
        }
      }
    } catch (e) {
      throw new SpVuexError('Demeris:GetAllBalances', 'Could not perform API query.');
    }
    return getters['getAllBalances'];
  },
  async [DemerisActionTypes.GET_ALL_STAKING_BALANCES]({ dispatch, getters, rootGetters }) {
    try {
      const keyHashes = rootGetters[GlobalDemerisGetterTypes.USER.getKeyhashes];

      if (featureRunning('REQUEST_PARALLELIZATION')) {
        const stakingBalanceLoads = [];
        for (const keyHash of keyHashes) {
          stakingBalanceLoads.push(
            dispatch(DemerisActionTypes.GET_STAKING_BALANCES, { subscribe: true, params: { address: keyHash } }),
          );
        }
        await Promise.all(stakingBalanceLoads);

        if (rootGetters[GlobalDemerisGetterTypes.USER.getStakingBalancesFirstLoad]) {
          dispatch(GlobalDemerisActionTypes.USER.STAKING_BALANCES_LOADED, null, { root: true });
        }
      } else {
        for (const keyHash of keyHashes) {
          await dispatch(DemerisActionTypes.GET_STAKING_BALANCES, { subscribe: true, params: { address: keyHash } });
        }
      }
    } catch (e) {
      throw new SpVuexError('Demeris:GetAllStakingBalances', 'Could not perform API query.');
    }
    return getters['getAllStakingBalances'];
  },
  async [DemerisActionTypes.GET_ALL_UNBONDING_DELEGATIONS]({ dispatch, getters, rootGetters }) {
    try {
      const keyHashes = rootGetters[GlobalDemerisGetterTypes.USER.getKeyhashes];
      for (const keyHash of keyHashes) {
        dispatch(DemerisActionTypes.GET_UNBONDING_DELEGATIONS, { subscribe: true, params: { address: keyHash } });
      }
    } catch (e) {
      throw new SpVuexError('Demeris:GetAllUnbondingDelegations', 'Could not perform API query.');
    }
    return getters['getAllUnbondingDelegations'];
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
  async [DemerisActionTypes.GET_STAKING_BALANCES](
    { commit, getters, state, rootGetters },
    { subscribe = false, params },
  ) {
    axios.defaults.headers.get['X-Correlation-Id'] = rootGetters[GlobalDemerisGetterTypes.USER.getCorrelationId];
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
  async [DemerisActionTypes.GET_UNBONDING_DELEGATIONS](
    { commit, getters, state, rootGetters },
    { subscribe = false, params },
  ) {
    axios.defaults.headers.get['X-Correlation-Id'] = rootGetters[GlobalDemerisGetterTypes.USER.getCorrelationId];
    const reqHash = hashObject({ action: DemerisActionTypes.GET_UNBONDING_DELEGATIONS, payload: { params } });

    if (state._InProgess.get(reqHash)) {
      await state._InProgess.get(reqHash);

      return getters['getUnbondingDelegations'](params);
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
          getters['getEndpoint'] + '/account/' + (params as API.AddrReq).address + '/unbondingdelegations',
        );
        commit(DemerisMutationTypes.SET_UNBONDING_DELEGATIONS, { params, value: response.data.unbonding_delegations });
        if (subscribe) {
          commit('SUBSCRIBE', { action: DemerisActionTypes.GET_UNBONDING_DELEGATIONS, payload: { params } });
        }
      } catch (e) {
        commit(DemerisMutationTypes.DELETE_IN_PROGRESS, reqHash);
        rejecter(e);
        if (subscribe) {
          commit('SUBSCRIBE', { action: DemerisActionTypes.GET_UNBONDING_DELEGATIONS, payload: { params } });
        }
        throw new SpVuexError('Demeris:GetUnbondingDelegations', 'Could not perform API query.');
      }
      commit(DemerisMutationTypes.DELETE_IN_PROGRESS, reqHash);
      resolver();

      return getters['getUnbondingDelegations'](params);
    }
  },
  async [DemerisActionTypes.GET_NUMBERS]({ commit, getters, rootGetters }, { subscribe = false, params }) {
    axios.defaults.headers.get['X-Correlation-Id'] = rootGetters[GlobalDemerisGetterTypes.USER.getCorrelationId];
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
  async [DemerisActionTypes.GET_NUMBERS_CHAIN]({ commit, getters, rootGetters }, { subscribe = false, params }) {
    axios.defaults.headers.get['X-Correlation-Id'] = rootGetters[GlobalDemerisGetterTypes.USER.getCorrelationId];
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

      if (featureRunning('REQUEST_PARALLELIZATION')) {
        const numberLoads = [];
        for (const keyHash of keyHashes) {
          numberLoads.push(dispatch(DemerisActionTypes.GET_NUMBERS, { subscribe: true, params: { address: keyHash } }));
        }
        await Promise.all(numberLoads);
      } else {
        for (const keyHash of keyHashes) {
          await dispatch(DemerisActionTypes.GET_NUMBERS, { subscribe: true, params: { address: keyHash } });
        }
      }
    } catch (e) {
      throw new SpVuexError('Demeris:GetAllNumbers', 'Could not perform API query.');
    }
    return getters['getAllNumbers'];
  },
  async [DemerisActionTypes.GET_VERIFIED_DENOMS]({ commit, getters, rootGetters }, { subscribe = false }) {
    axios.defaults.headers.get['X-Correlation-Id'] = rootGetters[GlobalDemerisGetterTypes.USER.getCorrelationId];
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
  async [DemerisActionTypes.GET_FEE_ADDRESSES]({ commit, getters, rootGetters }, { subscribe = false, params }) {
    axios.defaults.headers.get['X-Correlation-Id'] = rootGetters[GlobalDemerisGetterTypes.USER.getCorrelationId];
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
  async [DemerisActionTypes.GET_PRICES]({ commit, getters, rootGetters, state, dispatch }, { subscribe = false }) {
    axios.defaults.headers.get['X-Correlation-Id'] = rootGetters[GlobalDemerisGetterTypes.USER.getCorrelationId];
    const isCypress = !!window['Cypress'];
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
        if (response.data?.data?.Tokens) {
          if (isCypress) {
            commit(DemerisMutationTypes.SET_PRICES, {
              value: {
                Fiats: response.data.data.Fiats,
                Tokens: response.data.data.Tokens.map((x) => {
                  return { ...x, Price: 1.1 };
                }),
              },
            });
          } else {
            commit(DemerisMutationTypes.SET_PRICES, { value: response.data.data });
          }
          // Set initial prices so pool calculations can find them
          await Promise.all(
            getters['getVerifiedDenoms'].map(async (denom) => {
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
            }),
          );
          if (isCypress) {
            commit(DemerisMutationTypes.SET_PRICES, {
              value: {
                Fiats: response.data.data.Fiats,
                Tokens: response.data.data.Tokens.map((x) => {
                  return { ...x, Price: 1.1 };
                }),
              },
            });
          } else {
            commit(DemerisMutationTypes.SET_PRICES, { value: response.data.data });
          }
          // Set prices incl. pool calculations

          if (rootGetters[GlobalDemerisGetterTypes.USER.getPricesFirstLoad]) {
            dispatch(GlobalDemerisActionTypes.USER.PRICES_LOADED, null, { root: true });
          }
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
  async [DemerisActionTypes.GET_TX_STATUS]({ commit, getters, rootGetters }, { subscribe = false, params }) {
    axios.defaults.headers.get['X-Correlation-Id'] = rootGetters[GlobalDemerisGetterTypes.USER.getCorrelationId];
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
  async [DemerisActionTypes.GET_TX_DEST_HASH]({ getters, rootGetters }, { from_chain, to_chain, txhash }) {
    axios.defaults.headers.get['X-Correlation-Id'] = rootGetters[GlobalDemerisGetterTypes.USER.getCorrelationId];
    try {
      const response = await axios.get(`${getters['getEndpoint']}/tx/${from_chain}/${to_chain}/${txhash}`);
      const data = response.data;

      if (data.cause) {
        throw new Error(data);
      }

      if (!data.tx_hash) {
        throw new Error('Failed to fetch destination hash');
      }

      return response.data;
    } catch (e) {
      throw new SpVuexError('Demeris:GetTXDestHash', 'Could not perform API query.');
    }
  },

  async [DemerisActionTypes.GET_CHAINS]({ commit, getters, rootGetters }, { subscribe = false }) {
    axios.defaults.headers.get['X-Correlation-Id'] = rootGetters[GlobalDemerisGetterTypes.USER.getCorrelationId];
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

  async [DemerisActionTypes.GET_RELAYER_STATUS]({ commit, getters, rootGetters }, { subscribe = false }) {
    axios.defaults.headers.get['X-Correlation-Id'] = rootGetters[GlobalDemerisGetterTypes.USER.getCorrelationId];
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
  async [DemerisActionTypes.GET_RELAYER_BALANCES]({ commit, getters, rootGetters }, { subscribe = false }) {
    axios.defaults.headers.get['X-Correlation-Id'] = rootGetters[GlobalDemerisGetterTypes.USER.getCorrelationId];
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

  async [DemerisActionTypes.GET_VERIFY_TRACE](
    { commit, getters, state, rootGetters },
    { subscribe = false, cache = true, params },
  ) {
    axios.defaults.headers.get['X-Correlation-Id'] = rootGetters[GlobalDemerisGetterTypes.USER.getCorrelationId];
    const reqHash = hashObject({ action: DemerisActionTypes.GET_VERIFY_TRACE, payload: { params } });
    if (state._InProgess.get(reqHash) && cache) {
      await state._InProgess.get(reqHash);
      return getters['getVerifyTrace'](params);
    } else {
      let resolver;
      const promise = new Promise((resolve, _) => {
        resolver = resolve;
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
        const failedResp = {
          ibc_denom: 'ibc/' + (params as API.VerifyTraceReq).hash,
          base_denom: '',
          verified: false,
          path: '',
          trace: [],
        };
        commit(DemerisMutationTypes.SET_VERIFY_TRACE, { params, value: failedResp });
        if (subscribe) {
          commit('SUBSCRIBE', { action: DemerisActionTypes.GET_VERIFY_TRACE, payload: { params } });
        }
      }
      resolver();
      commit(DemerisMutationTypes.DELETE_IN_PROGRESS, reqHash);
      return getters['getVerifyTrace'](params);
    }
  },
  async [DemerisActionTypes.GET_FEE_ADDRESS]({ commit, getters, rootGetters }, { subscribe = false, params }) {
    axios.defaults.headers.get['X-Correlation-Id'] = rootGetters[GlobalDemerisGetterTypes.USER.getCorrelationId];
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
  async [DemerisActionTypes.GET_BECH32_CONFIG]({ commit, getters, rootGetters }, { subscribe = false, params }) {
    axios.defaults.headers.get['X-Correlation-Id'] = rootGetters[GlobalDemerisGetterTypes.USER.getCorrelationId];
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
  async [DemerisActionTypes.GET_CHAIN]({ commit, getters, state, rootGetters }, { subscribe = false, params }) {
    axios.defaults.headers.get['X-Correlation-Id'] = rootGetters[GlobalDemerisGetterTypes.USER.getCorrelationId];
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
        commit(DemerisMutationTypes.SET_CHAIN, { params, value: { ...response.data.chain, status: true } });
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
  async [DemerisActionTypes.GET_PRIMARY_CHANNEL]({ commit, getters, rootGetters }, { subscribe = false, params }) {
    axios.defaults.headers.get['X-Correlation-Id'] = rootGetters[GlobalDemerisGetterTypes.USER.getCorrelationId];
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
  async [DemerisActionTypes.GET_PRIMARY_CHANNELS]({ commit, getters, rootGetters }, { subscribe = false, params }) {
    axios.defaults.headers.get['X-Correlation-Id'] = rootGetters[GlobalDemerisGetterTypes.USER.getCorrelationId];
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
  async [DemerisActionTypes.GET_TOKEN_PRICES]({ commit, getters, rootGetters }, { subscribe = false, params }) {
    axios.defaults.headers.get['X-Correlation-Id'] = rootGetters[GlobalDemerisGetterTypes.USER.getCorrelationId];
    commit(DemerisMutationTypes.SET_TOKEN_PRICES_STATUS, {
      value: params.showSkeleton ? API.LoadingState.LOADING : API.LoadingState.LOADED,
    });
    try {
      const response = await axios.get(
        getters['getEndpoint'] + `/oracle/chart/${params.token_id}?days=${params.days}&vs_currency=${params.currency}`,
      );
      commit(DemerisMutationTypes.SET_TOKEN_PRICES, { value: response.data });
      commit(DemerisMutationTypes.SET_TOKEN_PRICES_STATUS, { value: API.LoadingState.LOADED });
      if (subscribe) {
        commit('SUBSCRIBE', { action: DemerisActionTypes.GET_TOKEN_PRICES, payload: { params } });
      }
    } catch (e) {
      commit(DemerisMutationTypes.SET_TOKEN_PRICES_STATUS, { value: API.LoadingState.ERROR });
      throw new SpVuexError('Demeris:getTokenPrices', 'Could not perform API query.');
    }
    return getters['getTokenPrices'];
  },
  async [DemerisActionTypes.GET_GIT_AIRDROPS_LIST]({ commit }, { subscribe = false }) {
    try {
      const response = await axios.get(`https://api.github.com/repos/allinbits/Emeris-Airdrop/contents/airdropList`);
      if (subscribe) {
        commit('SUBSCRIBE', { action: DemerisActionTypes.GET_GIT_AIRDROPS_LIST });
      }
      return response.data;
    } catch (e) {
      throw new SpVuexError('Demeris:gitAirdropsList', 'Could not perform API query.');
    }
  },
  async [DemerisActionTypes.GET_AIRDROPS]({ commit }, { subscribe = false, params }) {
    try {
      const response = await axios.get(
        `https://raw.githubusercontent.com/allinbits/Emeris-Airdrop/main/airdropList/${params.airdropFileName}`,
      );

      commit(DemerisMutationTypes.SET_AIRDROPS, { value: response.data });
      if (subscribe) {
        commit('SUBSCRIBE', { action: DemerisActionTypes.GET_AIRDROPS, payload: { params } });
      }
    } catch (e) {
      throw new SpVuexError('Demeris:getAirdrops', 'Could not perform API query.');
    }
  },
  [DemerisActionTypes.SET_SELECTED_AIRDROP]({ commit }, { params }) {
    commit(DemerisMutationTypes.SET_SELECTED_AIRDROP, { value: params.airdrop });
  },
  [DemerisActionTypes.RESET_TOKEN_PRICES]({ commit }) {
    commit(DemerisMutationTypes.SET_TOKEN_PRICES, { value: {} });
  },
  async [DemerisActionTypes.GET_TOKEN_ID]({ commit, getters, rootGetters }, { subscribe = false, params }) {
    axios.defaults.headers.get['X-Correlation-Id'] = rootGetters[GlobalDemerisGetterTypes.USER.getCorrelationId];
    commit(DemerisMutationTypes.SET_TOKEN_ID_STATUS, {
      value: params.showSkeleton ? API.LoadingState.LOADING : API.LoadingState.LOADED,
    });
    try {
      const response = await axios.get(getters['getEndpoint'] + `/oracle/geckoid?names=${params.token}`);
      commit(DemerisMutationTypes.SET_TOKEN_ID, { value: { ...response.data, token: params.token } });
      commit(DemerisMutationTypes.SET_TOKEN_ID_STATUS, { value: API.LoadingState.LOADED });
      if (subscribe) {
        commit('SUBSCRIBE', { action: DemerisActionTypes.GET_TOKEN_ID, payload: { params } });
      }
      return getters['getTokenId'];
    } catch (e) {
      commit(DemerisMutationTypes.SET_TOKEN_ID_STATUS, { value: API.LoadingState.ERROR });
      console.error('Demeris:getTokenId: Could not perform API query.');
    }
  },
  async [DemerisActionTypes.GET_CHAIN_STATUS]({ commit, getters, state, rootGetters }, { subscribe = false, params }) {
    axios.defaults.headers.get['X-Correlation-Id'] = rootGetters[GlobalDemerisGetterTypes.USER.getCorrelationId];
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

  async [DemerisActionTypes.GET_TXS]({ getters, rootGetters }, { chain_name, txhash }: DemerisActionsGetTxsParams) {
    axios.defaults.headers.get['X-Correlation-Id'] = rootGetters[GlobalDemerisGetterTypes.USER.getCorrelationId];
    try {
      const response = await axios.get(getters['getEndpoint'] + '/chain/' + chain_name + '/txs/' + txhash);
      return response.data;
    } catch (e) {
      throw new SpVuexError('Demeris:GetTicketTxs', 'Could not fetch ticket transactions.' + e.message);
    }
  },

  async [DemerisActionTypes.TRACE_TX_RESPONSE]({ getters }, { txhash, chain_name }) {
    return new Promise(async (resolve, reject) => {
      const timeout = 60000;
      const wsUrl = `${getters['getWebSocketEndpoint']}/chain/${chain_name}/websocket`;

      const wss = new TendermintWS({ server: wsUrl, timeout: 5000, autoReconnect: false });
      const txHash64 = Buffer.from(txhash, 'hex').toString('base64');
      const subscribeQuery = `tm.event = 'Tx' AND tx.hash = '${txhash}'`;

      let done = false;

      const getTxRPC = async () => {
        const result = await wss.call('tx', [txHash64, false]).catch(reject);
        handleMessage(result);
      };

      const subscribeTxRPC = () => {
        wss.subscribe(
          {
            query: subscribeQuery,
          },
          handleMessage,
        );
      };

      const handleOpen = () => {
        getTxRPC();
        subscribeTxRPC();
      };

      const handleMessage = async (data: Record<string, any>) => {
        if (done) return;

        if (data.error) {
          // Not found
          if (data.error.code === -32603) return;

          done = true;
          reject(new Error(data.error));
        }

        if (data.result?.data?.value?.TxResult) {
          done = true;
          resolve(data.result.data.value.TxResult);
        }

        if (data?.result?.tx_result) {
          done = true;
          resolve(data.result.tx_result);
        }
      };

      await wss.connect().catch(reject);
      handleOpen();

      setTimeout(() => {
        done = true;
        reject(new Error('Could not find transaction response'));
      }, timeout);
    });
  },

  async [DemerisActionTypes.GET_END_BLOCK_EVENTS](
    { getters, rootGetters },
    { height, stepType }: DemerisTxResultParams,
  ) {
    axios.defaults.headers.get['X-Correlation-Id'] = rootGetters[GlobalDemerisGetterTypes.USER.getCorrelationId];
    function sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    try {
      await sleep(800); // Apparently it takes some time for end block events to be available on the rpc endpoint after the tx is delivered and our tx ticket updates so this is why this was added originally.
      const response = await axios.get(`${getters['getEndpoint']}/block_results?height=${height}`);
      const successData = {};

      if (response.data.result?.end_block_events) {
        let isMine = false;

        const checks = getEndBlockChecks({
          type: stepType,
          requesterAddress: await getOwnAddress({ chain_name: getters['getDexChain'] }),
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

  async [DemerisActionTypes.GET_VALIDATORS]({ getters, rootGetters }, { chain_name }: DemerisGetValidatorsParam) {
    axios.defaults.headers.get['X-Correlation-Id'] = rootGetters[GlobalDemerisGetterTypes.USER.getCorrelationId];
    try {
      const response = await axios.get(getters['getEndpoint'] + '/chain/' + chain_name + '/validators');
      return response.data?.validators;
    } catch (e) {
      throw new SpVuexError('Demeris:GET_VALIDATORS', `Could not get ${chain_name} validators.` + e.message);
    }
  },

  async [DemerisActionTypes.GET_INFLATION]({ getters, rootGetters }, { chain_name }: DemerisGetInflationParam) {
    axios.defaults.headers.get['X-Correlation-Id'] = rootGetters[GlobalDemerisGetterTypes.USER.getCorrelationId];
    try {
      const response = await axios.get(getters['getEndpoint'] + '/chain/' + chain_name + '/mint/inflation');
      return Number(response.data?.inflation);
    } catch (e) {
      throw new SpVuexError('Demeris:GET_INFLATION', `Could not get ${chain_name} inflation.` + e.message);
    }
  },

  async [DemerisActionTypes.GET_STAKING_REWARDS]({ getters, rootGetters }, { chain_name }: DemerisGetRewardsParam) {
    axios.defaults.headers.get['X-Correlation-Id'] = rootGetters[GlobalDemerisGetterTypes.USER.getCorrelationId];
    try {
      const address = keyHashfromAddress(await getOwnAddress({ chain_name }));
      const response = await axios.get(
        getters['getEndpoint'] + '/account/' + address + '/delegatorrewards/' + chain_name,
      );
      return response.data;
    } catch (e) {
      throw new SpVuexError('Demeris:GET_REWARDS', `Could not get ${chain_name} rewards.` + e.message);
    }
  },

  // Internal module actions

  [DemerisActionTypes.INIT](
    { commit, dispatch },
    { endpoint, wsEndpoint, hub_chain = 'cosmos-hub', refreshTime = 5000, gas_limit = 500000 },
  ) {
    console.log('Vuex nodule: demeris initialized!');
    commit('INIT', { wsEndpoint, endpoint, hub_chain, gas_limit });
    setInterval(() => {
      dispatch(DemerisActionTypes.STORE_UPDATE);
    }, refreshTime);
  },
  [DemerisActionTypes.RESET_STATE]({ commit }) {
    commit(DemerisMutationTypes.RESET_STATE);
  },
  async [DemerisActionTypes.SIGN_OUT]({ commit, state }, keyHashes) {
    commit(DemerisMutationTypes.CLEAR_SUBSCRIPTIONS);
    // Although on the CLEAR_SUBSCRIPTIONS mutation we remove any subscriptions from the previously signed in account
    // there is a chance some requests were already in progress and may return after we clear them so we await completion
    // before deleting state data on SIGN_OUT mutation
    await Promise.all(state._InProgess.values());
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
