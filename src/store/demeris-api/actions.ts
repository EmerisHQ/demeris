import { EncodeObject, Registry } from '@cosmjs/proto-signing';
import { EmerisAirdrops, EmerisAPI, EmerisBase } from '@emeris/types';
import { SpVuexError } from '@starport/vuex';
import axios, { AxiosResponse } from 'axios';
import { ActionTree } from 'vuex';

import usePool from '@/composables/usePool';
import { GlobalActionTypes, GlobalGetterTypes, RootState } from '@/store';
import { Pool } from '@/types/actions';
import { UserData } from '@/types/user';
import { ActionParams, ChartPrices, LoadingState, SimpleSubscribable, Subscribable } from '@/types/util';
import { validPools } from '@/utils/actionHandler';
import { getOwnAddress, hashObject, keyHashfromAddress } from '@/utils/basic';
import TendermintWS from '@/utils/TendermintWS';

import { RootStoreTyped } from '../';
import { APIStore } from '.';
import { ActionTypes } from './action-types';
import { MutationTypes } from './mutation-types';
import { APIState } from './state';

type APIActionContext = {
  dispatch: Pick<APIStore<APIState>, 'dispatch'>['dispatch'] & Pick<RootStoreTyped, 'dispatch'>['dispatch'];
  commit: Pick<APIStore<APIState>, 'commit'>['commit'];
  state: APIState;
  getters: Pick<APIStore<APIState>, 'getters'>['getters'];
  rootState: RootState;
  rootGetters: Pick<RootStoreTyped, 'getters'>['getters'];
};

export type DemerisConfig = {
  endpoint: string;
  gitEndpoint: string;
  rawGitEndpoint: string;
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
  amount: Array<EmerisBase.Amount>;
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
export type DemerisGetUnstakingParam = {
  chain_name: string;
};
type Namespaced<T, N extends string> = {
  [P in keyof T & string as `${N}/${P}`]: T[P];
};

export type Subscription<K extends keyof Actions> = {
  action: K;
  payload?: Omit<Parameters<Actions[K]>[1], 'subscribe'>;
};
export type Subscriptions = Subscription<keyof Actions>;

export interface Actions {
  // Cross-chain endpoint actions
  [ActionTypes.GET_BALANCES](
    context: APIActionContext,
    payload: Subscribable<ActionParams<EmerisAPI.AddrReq>>,
  ): Promise<EmerisAPI.Balances>;
  [ActionTypes.GET_POOL_BALANCES](
    context: APIActionContext,
    payload: Subscribable<ActionParams<EmerisAPI.AddrReq>>,
  ): Promise<EmerisAPI.Balances>;
  [ActionTypes.GET_STAKING_BALANCES](
    context: APIActionContext,
    payload: Subscribable<ActionParams<EmerisAPI.AddrReq>>,
  ): Promise<EmerisAPI.StakingBalances>;
  [ActionTypes.GET_UNBONDING_DELEGATIONS](
    context: APIActionContext,
    payload: Subscribable<ActionParams<EmerisAPI.AddrReq>>,
  ): Promise<EmerisAPI.UnbondingDelegations>;
  [ActionTypes.GET_ALL_BALANCES](context: APIActionContext): Promise<EmerisAPI.Balances>;
  [ActionTypes.GET_ALL_STAKING_BALANCES](context: APIActionContext): Promise<EmerisAPI.StakingBalances>;
  [ActionTypes.GET_ALL_UNBONDING_DELEGATIONS](context: APIActionContext): Promise<EmerisAPI.UnbondingDelegations>;
  [ActionTypes.VALIDATE_POOLS](context: APIActionContext, pools: Pool[]): Promise<Pool[]>;
  [ActionTypes.GET_NUMBERS_CHAIN](
    context: APIActionContext,
    payload: Subscribable<ActionParams<EmerisAPI.ChainAddrReq>>,
  ): Promise<EmerisAPI.SeqNumber>;

  [ActionTypes.GET_VERIFIED_DENOMS](
    context: APIActionContext,
    payload: SimpleSubscribable,
  ): Promise<EmerisAPI.VerifiedDenoms>;
  [ActionTypes.GET_TX_STATUS](
    context: APIActionContext,
    payload: Subscribable<ActionParams<EmerisAPI.TicketReq>>,
  ): Promise<EmerisAPI.TicketResponse>;
  [ActionTypes.GET_CHAINS](
    context: APIActionContext,
    payload: SimpleSubscribable,
  ): Promise<Record<string, EmerisAPI.Chain>>;
  [ActionTypes.GET_PRICES](context: APIActionContext, payload: SimpleSubscribable): Promise<EmerisAPI.Prices>;
  [ActionTypes.GET_VERIFY_TRACE](
    context: APIActionContext,
    payload: Subscribable<ActionParams<EmerisAPI.VerifyTraceReq>>,
  ): Promise<EmerisAPI.VerifyTrace>;
  [ActionTypes.GET_CHAIN](
    context: APIActionContext,
    payload: Subscribable<ActionParams<EmerisAPI.ChainReq>>,
  ): Promise<EmerisAPI.Chain>;
  [ActionTypes.GET_TOKEN_PRICES](
    context: APIActionContext,
    payload: Subscribable<ActionParams<EmerisAPI.TokenPriceReq>>,
  ): Promise<ChartPrices>;
  [ActionTypes.RESET_TOKEN_PRICES](context: APIActionContext): void;
  [ActionTypes.GET_GIT_AIRDROPS_LIST](
    context: APIActionContext,
    payload: SimpleSubscribable,
  ): Promise<EmerisAirdrops.AirdropList>;
  [ActionTypes.GET_AIRDROPS](
    context: APIActionContext,
    payload: Subscribable<ActionParams<EmerisAirdrops.GitAirdropsListReq>>,
  ): Promise<void>;

  [ActionTypes.RESET_AIRDROPS](context: APIActionContext): void;
  [ActionTypes.SET_SELECTED_AIRDROP](
    context: APIActionContext,
    payload: ActionParams<EmerisAirdrops.selectedAirdropReq>,
  ): void;
  [ActionTypes.GET_TOKEN_ID](
    context: APIActionContext,
    payload: Subscribable<ActionParams<EmerisAPI.TokenIdReq>>,
  ): Promise<any>;
  [ActionTypes.GET_CHAIN_STATUS](
    context: APIActionContext,
    payload: Subscribable<ActionParams<EmerisAPI.ChainReq>>,
  ): Promise<boolean>;
  [ActionTypes.GET_END_BLOCK_EVENTS](context: APIActionContext, { height }: DemerisTxResultParams): Promise<unknown>;
  [ActionTypes.GET_VALIDATORS](
    context: APIActionContext,
    payload: Subscribable<ActionParams<EmerisAPI.ChainReq>>,
  ): Promise<EmerisAPI.Validator[]>;
  [ActionTypes.GET_INFLATION](
    context: APIActionContext,
    payload: Subscribable<ActionParams<EmerisAPI.ChainReq>>,
  ): Promise<number>;
  [ActionTypes.GET_STAKING_REWARDS](
    context: APIActionContext,
    payload: Subscribable<ActionParams<EmerisAPI.ChainReq>>,
  ): Promise<EmerisAPI.StakingRewardsResponse>;
  [ActionTypes.GET_UNSTAKING_PARAM](
    context: APIActionContext,
    payload: Subscribable<ActionParams<EmerisAPI.ChainReq>>,
  ): Promise<EmerisAPI.StakingParams>;

  [ActionTypes.INIT](context: APIActionContext, config: DemerisConfig): void;
  [ActionTypes.RESET_STATE](context: APIActionContext): void;
  [ActionTypes.SIGN_OUT](context: APIActionContext, keyHashes: string[]): void;
  [ActionTypes.UNSUBSCRIBE](context: APIActionContext, subscription: Subscriptions): void;
  [ActionTypes.STORE_UPDATE](context: APIActionContext): void;
}

export type GlobalActions = Namespaced<Actions, 'demerisAPI'>;

export const actions: ActionTree<APIState, RootState> & Actions = {
  // Cross-chain endpoint actions

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async [ActionTypes.GET_BALANCES]({ commit, dispatch, getters, state, rootGetters }, { subscribe = false, params }) {
    axios.defaults.headers.get['X-Correlation-Id'] = rootGetters[GlobalGetterTypes.USER.getCorrelationId];
    const reqHash = hashObject({ action: ActionTypes.GET_BALANCES, payload: { params } });

    if (state._InProgess.get(reqHash)) {
      await state._InProgess.get(reqHash);

      return getters['getBalances'](params);
    } else {
      let resolver;
      let rejecter;
      const promise: Promise<void> = new Promise((resolve, reject) => {
        resolver = resolve;
        rejecter = reject;
      });
      commit(MutationTypes.SET_IN_PROGRESS, { hash: reqHash, promise });
      try {
        const response: AxiosResponse<EmerisAPI.BalancesResponse> = await axios.get(
          getters['getEndpoint'] + '/account/' + params.address + '/balance',
        );

        if (response.data.balances) {
          const tracesLoaded = [];
          for (const balance of response.data.balances) {
            if (
              // balance.ibc holds resolved ibc denoms so we can show the name of the coin. this functions as a cache. so if it was loaded in the past we don't need to load it again.
              Object.keys(balance.ibc).length != 0 &&
              !getters['getVerifyTrace']({
                chain_name: balance.on_chain,
                hash: balance.ibc.hash,
              })
            ) {
              tracesLoaded.push(
                dispatch(ActionTypes.GET_VERIFY_TRACE, {
                  subscribe: false,
                  params: { chain_name: balance.on_chain, hash: balance.ibc.hash },
                }),
              );
            }
          }
          await Promise.all(tracesLoaded);
        }
        commit(MutationTypes.SET_BALANCES, { params, value: response.data.balances });
        if (subscribe) {
          commit(MutationTypes.SUBSCRIBE, { action: ActionTypes.GET_BALANCES, payload: { params } });
        }
      } catch (e) {
        commit(MutationTypes.DELETE_IN_PROGRESS, reqHash);
        rejecter(e);
        if (subscribe) {
          commit(MutationTypes.SUBSCRIBE, { action: ActionTypes.GET_BALANCES, payload: { params } });
        }
        throw new SpVuexError('Demeris:GetBalances', 'Could not perform API query.');
      }
      commit(MutationTypes.DELETE_IN_PROGRESS, reqHash);
      resolver();
      return getters['getBalances'](params);
    }
  },
  async [ActionTypes.GET_POOL_BALANCES]({ commit, getters, state, rootGetters }, { subscribe = false, params }) {
    axios.defaults.headers.get['X-Correlation-Id'] = rootGetters[GlobalGetterTypes.USER.getCorrelationId];
    const reqHash = hashObject({ action: ActionTypes.GET_POOL_BALANCES, payload: { params } });

    if (state._InProgess.get(reqHash)) {
      await state._InProgess.get(reqHash);

      return getters['getBalances'](params);
    } else {
      let resolver;
      let rejecter;
      const promise: Promise<void> = new Promise((resolve, reject) => {
        resolver = resolve;
        rejecter = reject;
      });
      commit(MutationTypes.SET_IN_PROGRESS, { hash: reqHash, promise });
      try {
        const response: AxiosResponse<EmerisAPI.BalancesResponse> = await axios.get(
          getters['getEndpoint'] + '/account/' + params.address + '/balance',
        );

        commit(MutationTypes.SET_POOL_BALANCES, { params, value: response.data.balances });
        if (subscribe) {
          commit(MutationTypes.SUBSCRIBE, { action: ActionTypes.GET_POOL_BALANCES, payload: { params } });
        }
      } catch (e) {
        commit(MutationTypes.DELETE_IN_PROGRESS, reqHash);
        rejecter(e);
        if (subscribe) {
          commit(MutationTypes.SUBSCRIBE, { action: ActionTypes.GET_POOL_BALANCES, payload: { params } });
        }
        throw new SpVuexError('Demeris:GetBalances', 'Could not perform API query.');
      }
      commit(MutationTypes.DELETE_IN_PROGRESS, reqHash);
      resolver();

      return getters['getBalances'](params);
    }
  },
  async [ActionTypes.GET_ALL_BALANCES]({ dispatch, getters, rootGetters }) {
    try {
      const keyHashes = rootGetters[GlobalGetterTypes.USER.getKeyhashes];

      const balanceLoads = [];

      const chains =
        getters['getChains'] ??
        (await dispatch(ActionTypes.GET_CHAINS, {
          subscribe: false,
        }));
      for (const chain in chains) {
        if (!chains[chain].primary_channel)
          chains[chain] = await dispatch(ActionTypes.GET_CHAIN, {
            subscribe: true,
            params: {
              chain_name: chain,
            },
          });
      }
      for (const keyHash of keyHashes) {
        balanceLoads.push(dispatch(ActionTypes.GET_BALANCES, { subscribe: true, params: { address: keyHash } }));
      }
      await Promise.all(balanceLoads);
      if (rootGetters[GlobalGetterTypes.USER.getBalancesFirstLoad]) {
        dispatch(GlobalActionTypes.USER.BALANCES_LOADED, null, { root: true });
      }
    } catch (e) {
      throw new SpVuexError('Demeris:GetAllBalances', 'Could not perform API query.');
    }
    return getters['getAllBalances'];
  },
  async [ActionTypes.GET_ALL_STAKING_BALANCES]({ dispatch, getters, rootGetters }) {
    try {
      const keyHashes = rootGetters[GlobalGetterTypes.USER.getKeyhashes];

      const stakingBalanceLoads = [];
      for (const keyHash of keyHashes) {
        stakingBalanceLoads.push(
          dispatch(ActionTypes.GET_STAKING_BALANCES, { subscribe: true, params: { address: keyHash } }),
        );
      }
      await Promise.all(stakingBalanceLoads);

      if (rootGetters[GlobalGetterTypes.USER.getStakingBalancesFirstLoad]) {
        dispatch(GlobalActionTypes.USER.STAKING_BALANCES_LOADED, null, { root: true });
      }
    } catch (e) {
      throw new SpVuexError('Demeris:GetAllStakingBalances', 'Could not perform API query.');
    }
    return getters['getAllStakingBalances'];
  },
  async [ActionTypes.GET_ALL_UNBONDING_DELEGATIONS]({ dispatch, getters, rootGetters }) {
    try {
      const keyHashes = rootGetters[GlobalGetterTypes.USER.getKeyhashes];
      for (const keyHash of keyHashes) {
        dispatch(ActionTypes.GET_UNBONDING_DELEGATIONS, { subscribe: true, params: { address: keyHash } });
      }
    } catch (e) {
      throw new SpVuexError('Demeris:GetAllUnbondingDelegations', 'Could not perform API query.');
    }
    return getters['getAllUnbondingDelegations'];
  },
  async [ActionTypes.VALIDATE_POOLS]({ commit, getters }, pools) {
    try {
      const vp = await validPools(pools);
      commit(MutationTypes.SET_VALID_POOLS, vp);
    } catch (e) {
      console.error(e);
      throw new SpVuexError('Demeris:ValidatePools', 'Could not perform pool validation.');
    }
    return getters['getAllValidPools'];
  },
  async [ActionTypes.GET_UNSTAKING_PARAM](
    { commit, getters },
    { subscribe: _subscribe, params: { chain_name } },
  ): Promise<EmerisAPI.StakingParams> {
    try {
      const {
        data: { params: unstakingParam },
      } = await axios.get(`${getters['getEndpoint']}/chain/${chain_name}/staking/params`);
      commit(MutationTypes.SET_UNSTAKING_PARAM, { params: { chain_name }, value: unstakingParam });
      return getters['getUnstakingParam']({ chain_name });
    } catch {
      throw new SpVuexError('Demeris:getUnstakingParam', 'Could not retrieve staking param.');
    }
  },
  async [ActionTypes.GET_STAKING_BALANCES]({ commit, getters, state, rootGetters }, { subscribe = false, params }) {
    axios.defaults.headers.get['X-Correlation-Id'] = rootGetters[GlobalGetterTypes.USER.getCorrelationId];
    const reqHash = hashObject({ action: ActionTypes.GET_STAKING_BALANCES, payload: { params } });

    if (state._InProgess.get(reqHash)) {
      await state._InProgess.get(reqHash);

      return getters['getStakingBalances'](params);
    } else {
      let resolver;
      let rejecter;
      const promise: Promise<void> = new Promise((resolve, reject) => {
        resolver = resolve;
        rejecter = reject;
      });
      commit(MutationTypes.SET_IN_PROGRESS, { hash: reqHash, promise });
      try {
        const response: AxiosResponse<EmerisAPI.StakingBalancesResponse> = await axios.get(
          getters['getEndpoint'] + '/account/' + params.address + '/stakingbalances',
        );
        commit(MutationTypes.SET_STAKING_BALANCES, { params, value: response.data.staking_balances });
        if (subscribe) {
          commit(MutationTypes.SUBSCRIBE, { action: ActionTypes.GET_STAKING_BALANCES, payload: { params } });
        }
      } catch (e) {
        commit(MutationTypes.DELETE_IN_PROGRESS, reqHash);
        rejecter(e);
        if (subscribe) {
          commit(MutationTypes.SUBSCRIBE, { action: ActionTypes.GET_STAKING_BALANCES, payload: { params } });
        }
        throw new SpVuexError('Demeris:GetStakingBalances', 'Could not perform API query.');
      }
      commit(MutationTypes.DELETE_IN_PROGRESS, reqHash);
      resolver();

      return getters['getStakingBalances'](params);
    }
  },
  async [ActionTypes.GET_UNBONDING_DELEGATIONS](
    { commit, getters, state, rootGetters },
    { subscribe = false, params },
  ) {
    axios.defaults.headers.get['X-Correlation-Id'] = rootGetters[GlobalGetterTypes.USER.getCorrelationId];
    const reqHash = hashObject({ action: ActionTypes.GET_UNBONDING_DELEGATIONS, payload: { params } });

    if (state._InProgess.get(reqHash)) {
      await state._InProgess.get(reqHash);

      return getters['getUnbondingDelegations'](params);
    } else {
      let resolver;
      let rejecter;
      const promise: Promise<void> = new Promise((resolve, reject) => {
        resolver = resolve;
        rejecter = reject;
      });
      commit(MutationTypes.SET_IN_PROGRESS, { hash: reqHash, promise });
      try {
        const response: AxiosResponse<EmerisAPI.UnbondingDelegationsResponse> = await axios.get(
          getters['getEndpoint'] + '/account/' + params.address + '/unbondingdelegations',
        );
        commit(MutationTypes.SET_UNBONDING_DELEGATIONS, { params, value: response.data.unbonding_delegations });
        if (subscribe) {
          commit(MutationTypes.SUBSCRIBE, { action: ActionTypes.GET_UNBONDING_DELEGATIONS, payload: { params } });
        }
      } catch (e) {
        commit(MutationTypes.DELETE_IN_PROGRESS, reqHash);
        rejecter(e);
        if (subscribe) {
          commit(MutationTypes.SUBSCRIBE, { action: ActionTypes.GET_UNBONDING_DELEGATIONS, payload: { params } });
        }
        throw new SpVuexError('Demeris:GetUnbondingDelegations', 'Could not perform API query.');
      }
      commit(MutationTypes.DELETE_IN_PROGRESS, reqHash);
      resolver();

      return getters['getUnbondingDelegations'](params);
    }
  },
  async [ActionTypes.GET_NUMBERS_CHAIN]({ commit, getters, rootGetters }, { subscribe = false, params }) {
    axios.defaults.headers.get['X-Correlation-Id'] = rootGetters[GlobalGetterTypes.USER.getCorrelationId];
    try {
      const response: AxiosResponse<EmerisAPI.NumbersResponse> = await axios.get(
        getters['getEndpoint'] + '/chain/' + params.chain_name + '/numbers/' + params.address,
      );
      commit(MutationTypes.SET_NUMBERS_CHAIN, { params, value: response.data.numbers });
      if (subscribe) {
        commit(MutationTypes.SUBSCRIBE, { action: ActionTypes.GET_NUMBERS_CHAIN, payload: { params } });
      }
    } catch (e) {
      throw new SpVuexError('Demeris:GetNumbersChain', 'Could not perform API query.');
    }
    return getters['getNumbersChain'](params);
  },
  async [ActionTypes.GET_VERIFIED_DENOMS]({ commit, getters, rootGetters }, { subscribe = false }) {
    axios.defaults.headers.get['X-Correlation-Id'] = rootGetters[GlobalGetterTypes.USER.getCorrelationId];
    try {
      const response: AxiosResponse<EmerisAPI.VerifiedDenomsResponse> = await axios.get(
        getters['getEndpoint'] + '/verified_denoms',
      );
      commit(MutationTypes.SET_VERIFIED_DENOMS, { value: response.data.verified_denoms });
      if (subscribe) {
        commit(MutationTypes.SUBSCRIBE, { action: ActionTypes.GET_VERIFIED_DENOMS, payload: {} });
      }
    } catch (e) {
      throw new SpVuexError('Demeris:GetVerifiedDenoms', 'Could not perform API query.');
    }
    return getters['getVerifiedDenoms'];
  },
  async [ActionTypes.GET_PRICES]({ commit, getters, rootGetters, state, dispatch }, { subscribe = false }) {
    axios.defaults.headers.get['X-Correlation-Id'] = rootGetters[GlobalGetterTypes.USER.getCorrelationId];
    const isCypress = !!window['Cypress'];
    const reqHash = hashObject({ action: ActionTypes.GET_PRICES, payload: {} });

    if (state._InProgess.get(reqHash)) {
      await state._InProgess.get(reqHash);

      return getters['getPrices'];
    } else {
      let resolver;
      let rejecter;
      const promise: Promise<void> = new Promise((resolve, reject) => {
        resolver = resolve;
        rejecter = reject;
      });
      commit(MutationTypes.SET_IN_PROGRESS, { hash: reqHash, promise });
      try {
        const response: AxiosResponse<EmerisAPI.PricesResponse> = await axios.get(
          getters['getEndpoint'] + '/oracle/prices',
        );
        if (response.data?.data?.Tokens) {
          if (isCypress) {
            commit(MutationTypes.SET_PRICES, {
              value: {
                Fiats: response.data.data.Fiats,
                Tokens: response.data.data.Tokens.map((x) => {
                  return { ...x, Price: 1.1 };
                }),
              },
            });
          } else {
            commit(MutationTypes.SET_PRICES, { value: response.data.data });
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
            commit(MutationTypes.SET_PRICES, {
              value: {
                Fiats: response.data.data.Fiats,
                Tokens: response.data.data.Tokens.map((x) => {
                  return { ...x, Price: 1.1 };
                }),
              },
            });
          } else {
            commit(MutationTypes.SET_PRICES, { value: response.data.data });
          }
          // Set prices incl. pool calculations

          if (rootGetters[GlobalGetterTypes.USER.getPricesFirstLoad]) {
            dispatch(GlobalActionTypes.USER.PRICES_LOADED, null, { root: true });
          }
        }
        if (subscribe) {
          commit(MutationTypes.SUBSCRIBE, { action: ActionTypes.GET_PRICES, payload: {} });
        }
      } catch (e) {
        commit(MutationTypes.DELETE_IN_PROGRESS, reqHash);
        rejecter(e);
        if (subscribe) {
          commit(MutationTypes.SUBSCRIBE, { action: ActionTypes.GET_PRICES, payload: {} });
        }
        throw new SpVuexError('Demeris:GetPrices', 'Could not perform API query.');
      }
      commit(MutationTypes.DELETE_IN_PROGRESS, reqHash);
      resolver();
      return getters['getPrices'];
    }
  },
  async [ActionTypes.GET_TX_STATUS]({ commit, getters, rootGetters }, { subscribe = false, params }) {
    axios.defaults.headers.get['X-Correlation-Id'] = rootGetters[GlobalGetterTypes.USER.getCorrelationId];
    try {
      const response: AxiosResponse<EmerisAPI.TicketResponse> = await axios.get(
        getters['getEndpoint'] + '/tx/ticket/' + params.chain_name + '/' + params.ticket,
      );
      commit(MutationTypes.SET_TX_STATUS, { params, value: response.data });
      if (subscribe) {
        commit(MutationTypes.SUBSCRIBE, { action: ActionTypes.GET_TX_STATUS, payload: { params } });
      }
    } catch (e) {
      console.error(e);
      throw new SpVuexError('Demeris:GetTXStatus', 'Could not perform API query.');
    }
    return getters['getTxStatus'](params);
  },
  async [ActionTypes.GET_TX_DEST_HASH]({ getters, rootGetters }, { from_chain, to_chain, txhash }) {
    axios.defaults.headers.get['X-Correlation-Id'] = rootGetters[GlobalGetterTypes.USER.getCorrelationId];
    try {
      const response: AxiosResponse<EmerisAPI.DestinationTXResponse> = await axios.get(
        `${getters['getEndpoint']}/tx/${from_chain}/${to_chain}/${txhash}`,
      );
      const data = response.data;

      if (data.cause) {
        throw new Error(data.cause);
      }

      if (!data.tx_hash) {
        throw new Error('Failed to fetch destination hash');
      }

      return response.data;
    } catch (e) {
      throw new SpVuexError('Demeris:GetTXDestHash', 'Could not perform API query.');
    }
  },

  async [ActionTypes.GET_CHAINS]({ commit, getters, rootGetters }, { subscribe = false }) {
    axios.defaults.headers.get['X-Correlation-Id'] = rootGetters[GlobalGetterTypes.USER.getCorrelationId];
    try {
      const response: AxiosResponse<EmerisAPI.ChainsResponse> = await axios.get(getters['getEndpoint'] + '/chains');
      commit(MutationTypes.SET_CHAINS, { value: response.data.chains });
      if (subscribe) {
        commit(MutationTypes.SUBSCRIBE, { action: ActionTypes.GET_CHAINS, payload: {} });
      }
    } catch (e) {
      throw new SpVuexError('Demeris:GetChains', 'Could not perform API query.');
    }
    return getters['getChains'];
  },

  // Chain-specific endpoint actions

  async [ActionTypes.GET_VERIFY_TRACE]({ commit, getters, state, rootGetters }, { subscribe = false, params }) {
    axios.defaults.headers.get['X-Correlation-Id'] = rootGetters[GlobalGetterTypes.USER.getCorrelationId];
    const reqHash = hashObject({ action: ActionTypes.GET_VERIFY_TRACE, payload: { params } });
    if (state._InProgess.get(reqHash)) {
      await state._InProgess.get(reqHash);
      return getters['getVerifyTrace'](params);
    } else {
      let resolver;
      const promise: Promise<void> = new Promise((resolve, _) => {
        resolver = resolve;
      });
      commit(MutationTypes.SET_IN_PROGRESS, { hash: reqHash, promise });
      try {
        const response: AxiosResponse<EmerisAPI.VerifyTraceResponse> = await axios.get(
          getters['getEndpoint'] + '/chain/' + params.chain_name + '/denom/verify_trace/' + params.hash,
        );
        if (response && response.data && response.data.verify_trace) {
          commit(MutationTypes.SET_VERIFY_TRACE, { params, value: response.data.verify_trace });
        }
        if (subscribe) {
          commit(MutationTypes.SUBSCRIBE, { action: ActionTypes.GET_VERIFY_TRACE, payload: { params } });
        }
      } catch (e) {
        const failedResp = {
          ibc_denom: 'ibc/' + params.hash,
          base_denom: '',
          verified: false,
          cause: 'Trace Request failed',
          path: '',
          trace: [],
        };
        commit(MutationTypes.SET_VERIFY_TRACE, { params, value: failedResp });
        if (subscribe) {
          commit(MutationTypes.SUBSCRIBE, { action: ActionTypes.GET_VERIFY_TRACE, payload: { params } });
        }
      }
      resolver();
      commit(MutationTypes.DELETE_IN_PROGRESS, reqHash);
      return getters['getVerifyTrace'](params);
    }
  },
  async [ActionTypes.GET_CHAIN]({ commit, getters, state, rootGetters }, { subscribe = false, params }) {
    axios.defaults.headers.get['X-Correlation-Id'] = rootGetters[GlobalGetterTypes.USER.getCorrelationId];
    const reqHash = hashObject({ action: ActionTypes.GET_CHAIN, payload: { params } });

    if (state._InProgess.get(reqHash)) {
      await state._InProgess.get(reqHash);

      return getters['getChain'](params);
    } else {
      let resolver;
      let rejecter;
      const promise: Promise<void> = new Promise((resolve, reject) => {
        resolver = resolve;
        rejecter = reject;
      });
      commit(MutationTypes.SET_IN_PROGRESS, { hash: reqHash, promise });
      try {
        const response: AxiosResponse<EmerisAPI.ChainResponse> = await axios.get(
          getters['getEndpoint'] + '/chain/' + params.chain_name,
        );
        commit(MutationTypes.SET_CHAIN, { params, value: { ...response.data.chain, status: true } });
        if (subscribe) {
          commit(MutationTypes.SUBSCRIBE, { action: ActionTypes.GET_CHAIN, payload: { params } });
        }
      } catch (e) {
        commit(MutationTypes.DELETE_IN_PROGRESS, reqHash);
        rejecter(e);
        if (subscribe) {
          commit(MutationTypes.SUBSCRIBE, { action: ActionTypes.GET_CHAIN, payload: { params } });
        }
        throw new SpVuexError('Demeris:GetChain', 'Could not perform API query.');
      }
      resolver();
      commit(MutationTypes.DELETE_IN_PROGRESS, reqHash);
      return getters['getChain'](params);
    }
  },
  async [ActionTypes.GET_TOKEN_PRICES]({ commit, getters, rootGetters }, { subscribe = false, params }) {
    axios.defaults.headers.get['X-Correlation-Id'] = rootGetters[GlobalGetterTypes.USER.getCorrelationId];
    commit(MutationTypes.SET_TOKEN_PRICES_STATUS, {
      value: params.showSkeleton ? LoadingState.LOADING : LoadingState.LOADED,
    });
    try {
      const response: AxiosResponse<EmerisAPI.TokenPriceResponse> = await axios.get(
        getters['getEndpoint'] + `/oracle/chart/${params.token_id}?days=${params.days}&vs_currency=${params.currency}`,
      );
      commit(MutationTypes.SET_TOKEN_PRICES, { value: response.data.data.prices });
      commit(MutationTypes.SET_TOKEN_PRICES_STATUS, { value: LoadingState.LOADED });
      if (subscribe) {
        commit(MutationTypes.SUBSCRIBE, { action: ActionTypes.GET_TOKEN_PRICES, payload: { params } });
      }
    } catch (e) {
      commit(MutationTypes.SET_TOKEN_PRICES_STATUS, { value: LoadingState.ERROR });
      throw new SpVuexError('Demeris:getTokenPrices', 'Could not perform API query.');
    }
    return getters['getTokenPrices'];
  },
  async [ActionTypes.GET_GIT_AIRDROPS_LIST]({ commit, getters }, { subscribe = false }) {
    try {
      delete axios.defaults.headers.get['X-Correlation-Id'];
      const response: AxiosResponse<EmerisAirdrops.AirdropList> = await axios.get(
        `${getters['getGitEndpoint']}/repos/allinbits/Emeris-Airdrop/contents/airdropList`,
      );
      if (subscribe) {
        commit(MutationTypes.SUBSCRIBE, { action: ActionTypes.GET_GIT_AIRDROPS_LIST });
      }
      return response.data;
    } catch (e) {
      throw new SpVuexError('Demeris:gitAirdropsList', 'Could not perform API query.');
    }
  },
  async [ActionTypes.GET_AIRDROPS]({ commit, getters }, { subscribe = false, params }) {
    commit(MutationTypes.SET_AIRDROPS_STATUS, {
      value: LoadingState.LOADING,
    });
    try {
      delete axios.defaults.headers.get['X-Correlation-Id'];
      const response: AxiosResponse<EmerisAirdrops.Airdrop> = await axios.get(
        `${getters['getRawGitEndpoint']}/allinbits/Emeris-Airdrop/main/airdropList/${params.airdropFileName}`,
      );
      commit(MutationTypes.SET_AIRDROPS_STATUS, {
        value: LoadingState.LOADED,
      });

      commit(MutationTypes.SET_AIRDROPS, { value: response.data });
      if (subscribe) {
        commit(MutationTypes.SUBSCRIBE, { action: ActionTypes.GET_AIRDROPS, payload: { params } });
      }
    } catch (e) {
      commit(MutationTypes.SET_AIRDROPS_STATUS, {
        value: LoadingState.ERROR,
      });
      throw new SpVuexError('Demeris:getAirdrops', 'Could not perform API query.');
    }
  },
  [ActionTypes.SET_SELECTED_AIRDROP]({ commit }, { params }) {
    commit(MutationTypes.SET_SELECTED_AIRDROP, { value: params.airdrop });
  },
  [ActionTypes.RESET_AIRDROPS]({ commit }) {
    commit(MutationTypes.RESET_AIRDROPS);
  },
  [ActionTypes.RESET_TOKEN_PRICES]({ commit }) {
    commit(MutationTypes.SET_TOKEN_PRICES, { value: [] });
  },
  async [ActionTypes.GET_TOKEN_ID]({ commit, getters, rootGetters }, { subscribe = false, params }) {
    axios.defaults.headers.get['X-Correlation-Id'] = rootGetters[GlobalGetterTypes.USER.getCorrelationId];
    commit(MutationTypes.SET_TOKEN_ID_STATUS, {
      value: params.showSkeleton ? LoadingState.LOADING : LoadingState.LOADED,
    });
    try {
      const response: AxiosResponse<EmerisAPI.TokenIdResponse> = await axios.get(
        getters['getEndpoint'] + `/oracle/geckoid?names=${params.token}`,
      );
      commit(MutationTypes.SET_TOKEN_ID, { params, value: response.data });
      commit(MutationTypes.SET_TOKEN_ID_STATUS, { value: LoadingState.LOADED });
      if (subscribe) {
        commit(MutationTypes.SUBSCRIBE, { action: ActionTypes.GET_TOKEN_ID, payload: { params } });
      }
      return getters['getTokenId'];
    } catch (e) {
      commit(MutationTypes.SET_TOKEN_ID_STATUS, { value: LoadingState.ERROR });
      console.error('Demeris:getTokenId: Could not perform API query.');
    }
  },
  async [ActionTypes.GET_CHAIN_STATUS]({ commit, getters, state, rootGetters }, { subscribe = false, params }) {
    axios.defaults.headers.get['X-Correlation-Id'] = rootGetters[GlobalGetterTypes.USER.getCorrelationId];
    const reqHash = hashObject({ action: ActionTypes.GET_CHAIN_STATUS, payload: { params } });

    if (state._InProgess.get(reqHash)) {
      await state._InProgess.get(reqHash);

      return getters['getChainStatus'](params);
    } else {
      let resolver;
      let rejecter;
      const promise: Promise<void> = new Promise((resolve, reject) => {
        resolver = resolve;
        rejecter = reject;
      });
      commit(MutationTypes.SET_IN_PROGRESS, { hash: reqHash, promise });
      try {
        const response: AxiosResponse<EmerisAPI.ChainStatusResponse> = await axios.get(
          getters['getEndpoint'] + '/chain/' + params.chain_name + '/status',
        );
        commit(MutationTypes.SET_CHAIN_STATUS, { params, value: response.data.online });
        if (subscribe) {
          commit(MutationTypes.SUBSCRIBE, { action: ActionTypes.GET_CHAIN_STATUS, payload: { params } });
        }
      } catch (e) {
        commit(MutationTypes.DELETE_IN_PROGRESS, reqHash);
        rejecter(e);
        if (subscribe) {
          commit(MutationTypes.SUBSCRIBE, { action: ActionTypes.GET_CHAIN_STATUS, payload: { params } });
        }
        throw new SpVuexError('Demeris:GetChainStatus', 'Could not perform API query.');
      }
      resolver();
      commit(MutationTypes.DELETE_IN_PROGRESS, reqHash);
      return getters['getChainStatus'](params);
    }
  },

  async [ActionTypes.TRACE_TX_RESPONSE]({ getters }, { txhash, chain_name }) {
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

  async [ActionTypes.GET_END_BLOCK_EVENTS]({ getters, rootGetters }, { height, stepType }: DemerisTxResultParams) {
    axios.defaults.headers.get['X-Correlation-Id'] = rootGetters[GlobalGetterTypes.USER.getCorrelationId];
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

  async [ActionTypes.GET_VALIDATORS]({ getters, rootGetters }, { subscribe: _subscribe, params: { chain_name } }) {
    axios.defaults.headers.get['X-Correlation-Id'] = rootGetters[GlobalGetterTypes.USER.getCorrelationId];
    try {
      const response: AxiosResponse<EmerisAPI.ValidatorsResponse> = await axios.get(
        getters['getEndpoint'] + '/chain/' + chain_name + '/validators',
      );
      return response.data?.validators;
    } catch (e) {
      throw new SpVuexError('Demeris:GET_VALIDATORS', `Could not get ${chain_name} validators.` + e.message);
    }
  },

  async [ActionTypes.GET_INFLATION]({ getters, rootGetters }, { subscribe: _subscribe, params: { chain_name } }) {
    axios.defaults.headers.get['X-Correlation-Id'] = rootGetters[GlobalGetterTypes.USER.getCorrelationId];
    try {
      const response: AxiosResponse<EmerisAPI.InflationResponse> = await axios.get(
        getters['getEndpoint'] + '/chain/' + chain_name + '/mint/inflation',
      );
      return Number(response.data?.inflation);
    } catch (e) {
      throw new SpVuexError('Demeris:GET_INFLATION', `Could not get ${chain_name} inflation.` + e.message);
    }
  },

  async [ActionTypes.GET_STAKING_REWARDS]({ getters, rootGetters }, { subscribe: _subscribe, params: { chain_name } }) {
    axios.defaults.headers.get['X-Correlation-Id'] = rootGetters[GlobalGetterTypes.USER.getCorrelationId];
    try {
      const address = keyHashfromAddress(await getOwnAddress({ chain_name }));
      const response: AxiosResponse<EmerisAPI.StakingRewardsResponse> = await axios.get(
        getters['getEndpoint'] + '/account/' + address + '/delegatorrewards/' + chain_name,
      );
      return response.data;
    } catch (e) {
      throw new SpVuexError('Demeris:GET_REWARDS', `Could not get ${chain_name} rewards.` + e.message);
    }
  },

  // Internal module actions

  [ActionTypes.INIT](
    { commit, dispatch },
    {
      endpoint,
      gitEndpoint,
      rawGitEndpoint,
      wsEndpoint,
      hub_chain = 'cosmos-hub',
      refreshTime = 5000,
      gas_limit = 500000,
    },
  ) {
    console.log('Vuex nodule: demeris initialized!');
    commit(MutationTypes.INIT, { wsEndpoint, endpoint, gitEndpoint, rawGitEndpoint, hub_chain, gas_limit });
    setInterval(() => {
      dispatch(ActionTypes.STORE_UPDATE);
    }, refreshTime);
  },
  [ActionTypes.RESET_STATE]({ commit }) {
    commit(MutationTypes.RESET_STATE);
  },
  async [ActionTypes.SIGN_OUT]({ commit, state }, keyHashes) {
    commit(MutationTypes.CLEAR_SUBSCRIPTIONS);
    // Although on the CLEAR_SUBSCRIPTIONS mutation we remove any subscriptions from the previously signed in account
    // there is a chance some requests were already in progress and may return after we clear them so we await completion
    // before deleting state data on SIGN_OUT mutation
    await Promise.all(state._InProgess.values());
    commit(MutationTypes.SIGN_OUT, keyHashes);
  },
  [ActionTypes.STORE_UPDATE]({ state, dispatch }) {
    state._Subscriptions.forEach(async (subscription_json) => {
      const subscription = JSON.parse(subscription_json);
      try {
        await dispatch(subscription.action, subscription.payload);
      } catch (e) {
        console.error(e);
      }
    });
  },
  [ActionTypes.UNSUBSCRIBE]({ commit }, subscription) {
    commit(MutationTypes.UNSUBSCRIBE, subscription);
  },
};
