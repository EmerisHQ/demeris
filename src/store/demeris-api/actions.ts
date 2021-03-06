import { EncodeObject, Registry } from '@cosmjs/proto-signing';
import { EmerisAPI, EmerisBase } from '@emeris/types';
import axios, { AxiosResponse } from 'axios';
import { ActionTree } from 'vuex';

import { GlobalGetterTypes, RootState } from '@/store';
import { Pool } from '@/types/actions';
import { UserData } from '@/types/user';
import { ActionParams, SimpleSubscribable, Subscribable } from '@/types/util';
import { validPools } from '@/utils/actionHandler';
import { getOwnAddress, hashObject } from '@/utils/basic';
import EmerisError from '@/utils/EmerisError';
import TendermintWS from '@/utils/TendermintWS';

import { RootStoreTyped } from '../';
import { featureRunning } from './../../utils/FeatureManager';
import { APIStore } from '.';
import { ActionTypes } from './action-types';
import { AirdropActions, AirdropActionsInterface } from './actions/airdrops';
import { BalanceActions, BalanceActionsInterface } from './actions/balances';
import { ChainActions, ChainActionsInterface } from './actions/chain';
import { PriceActions, PriceActionsInterface } from './actions/prices';
import { StakingActions, StakingActionsInterface } from './actions/staking';
import { TransactionActions, TransactionActionsInterface } from './actions/transactions';
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

export interface Actions
  extends ChainActionsInterface,
    AirdropActionsInterface,
    BalanceActionsInterface,
    StakingActionsInterface,
    PriceActionsInterface,
    TransactionActionsInterface {
  //Pools Action types
  [ActionTypes.VALIDATE_POOLS](context: APIActionContext, pools: Pool[]): Promise<Pool[]>;

  //Uncategorized Action types
  [ActionTypes.GET_VERIFIED_DENOMS](
    context: APIActionContext,
    payload: SimpleSubscribable,
  ): Promise<EmerisAPI.VerifiedDenoms>;
  [ActionTypes.GET_VERIFY_TRACE](
    context: APIActionContext,
    payload: Subscribable<ActionParams<EmerisAPI.VerifyTraceReq>>,
  ): Promise<EmerisAPI.VerifyTrace>;
  [ActionTypes.GET_END_BLOCK_EVENTS](context: APIActionContext, { height }: DemerisTxResultParams): Promise<unknown>;
  [ActionTypes.INIT](context: APIActionContext, config: DemerisConfig): void;
  [ActionTypes.RESET_STATE](context: APIActionContext): void;
  [ActionTypes.SIGN_OUT](context: APIActionContext, keyHashes: string[]): void;
  [ActionTypes.UNSUBSCRIBE](context: APIActionContext, subscription: Subscriptions): void;
  [ActionTypes.STORE_UPDATE](context: APIActionContext): void;
}

export type GlobalActions = Namespaced<Actions, 'demerisAPI'>;

export const actions: ActionTree<APIState, RootState> & Actions = {
  ...ChainActions,
  ...AirdropActions,
  ...BalanceActions,
  ...StakingActions,
  ...PriceActions,
  ...TransactionActions,

  async [ActionTypes.VALIDATE_POOLS]({ commit, getters }, pools) {
    try {
      const vp = await validPools(pools);
      commit(MutationTypes.SET_VALID_POOLS, vp);
    } catch (e) {
      console.error(e);
      throw new EmerisError('Demeris:ValidatePools', 'Could not perform pool validation.');
    }
    return getters['getAllValidPools'];
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
      throw new EmerisError('Demeris:GetVerifiedDenoms', 'Could not perform API query.');
    }
    return getters['getVerifiedDenoms'];
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
        if (response?.data?.verify_trace?.trace) {
          commit(MutationTypes.SET_VERIFY_TRACE, { params, value: response.data.verify_trace });
        } else {
          console.error('Demeris:GetVerifyTrace', response.data.verify_trace.cause);
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
  async [ActionTypes.GET_NEW_BLOCK]({ getters }, { chain_name }) {
    return new Promise(async (resolve, reject) => {
      const timeout = 30000;

      const wsUrl = `${getters['getWebSocketEndpoint']}/chain/${chain_name}/rpc/websocket`;
      const wss = new TendermintWS({ server: wsUrl, timeout: 5000, autoReconnect: false });

      await wss.connect().catch(reject);
      const query = `tm.event = 'NewBlock'`;

      wss.subscribe({ query }, (data: Record<string, any>) => {
        if (data.result.data) {
          resolve(data.result.data);
          wss.unsubscribe({ query }, () => void 0);
        }
      });

      setTimeout(() => {
        reject(new Error('ERR_WSS_TIMEOUT'));
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
      throw new EmerisError('Demeris: GET_END_BLOCK_EVENTS', 'Could not GET_END_BLOCK_EVENTS.' + e.message);
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
    if (!featureRunning('DEBUG')) {
      setInterval(() => {
        dispatch(ActionTypes.STORE_UPDATE);
      }, refreshTime);
    }
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
