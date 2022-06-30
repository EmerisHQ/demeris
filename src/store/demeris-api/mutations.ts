/* eslint-disable max-lines-per-function */
/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/naming-convention */
import { EmerisAirdrops, EmerisAPI } from '@emeris/types';
import isEqual from 'lodash.isequal';
import { MutationTree } from 'vuex';

import { Pool } from '@/types/actions';
import { APIPromise, ChartPrices, LoadingState } from '@/types/util';

import { ActionTypes } from './action-types';
import { DemerisConfig, Subscriptions } from './actions';
import { MutationTypes } from './mutation-types';
import { APIState, getDefaultState } from './state';

export type Mutations<S = APIState> = {
  [MutationTypes.SET_BALANCES](state: S, payload: { params: EmerisAPI.AddrReq; value: EmerisAPI.Balances }): void;
  [MutationTypes.SET_POOL_BALANCES](state: S, payload: { params: EmerisAPI.AddrReq; value: EmerisAPI.Balances }): void;
  [MutationTypes.SET_STAKING_BALANCES](
    state: S,
    payload: { params: EmerisAPI.AddrReq; value: EmerisAPI.StakingBalances },
  ): void;
  [MutationTypes.SET_UNSTAKING_PARAM](
    state: S,
    payload: { params: EmerisAPI.ChainReq; value: EmerisAPI.StakingParams },
  ): void;
  [MutationTypes.SET_UNBONDING_DELEGATIONS](
    state: S,
    payload: { params: EmerisAPI.AddrReq; value: EmerisAPI.UnbondingDelegations },
  ): void;
  [MutationTypes.SET_NUMBERS_CHAIN](
    state: S,
    payload: { params: EmerisAPI.ChainAddrReq; value: EmerisAPI.SeqNumber },
  ): void;
  [MutationTypes.SET_VERIFIED_DENOMS](state: S, payload: { value: EmerisAPI.VerifiedDenoms }): void;
  [MutationTypes.SET_VALID_POOLS](state: S, payload: Pool[]): void;
  [MutationTypes.SET_CHAINS](state: S, payload: { value: EmerisAPI.SupportedChain[] }): void;
  [MutationTypes.SET_CHAIN_APR](state: S, payload: { params: EmerisAPI.ChainReq; value: string }): void;
  [MutationTypes.SET_PRICES](state: S, payload: { value: EmerisAPI.Prices }): void;
  [MutationTypes.SET_TX_STATUS](
    state: S,
    payload: { params: EmerisAPI.TicketReq; value: EmerisAPI.TicketResponse },
  ): void;

  [MutationTypes.SET_VERIFY_TRACE](
    state: S,
    payload: { params: EmerisAPI.VerifyTraceReq; value: EmerisAPI.VerifyTrace },
  ): void;
  [MutationTypes.SET_CHAIN](state: S, payload: { params: EmerisAPI.ChainReq; value: EmerisAPI.Chain }): void;
  [MutationTypes.SET_TOKEN_PRICES](state: S, payload: { value: Array<[number, number]> }): void;
  [MutationTypes.SET_TOKEN_PRICES_STATUS](state: S, payload: { value: LoadingState }): void;
  [MutationTypes.SET_AIRDROPS_STATUS](state: S, payload: { value: LoadingState }): void;
  [MutationTypes.SET_CHAIN_STATUS](state: S, payload: { params: EmerisAPI.ChainReq; value: boolean }): void;
  [MutationTypes.SET_AIRDROPS](state: S, payload: { value: EmerisAirdrops.Airdrop }): void;
  [MutationTypes.RESET_AIRDROPS](state: S): void;
  [MutationTypes.INIT](state: S, payload: DemerisConfig): void;
  [MutationTypes.SET_IN_PROGRESS](state: S, payload: APIPromise): void;
  [MutationTypes.DELETE_IN_PROGRESS](state: S, payload: string): void;
  [MutationTypes.RESET_STATE](state: S): void;
  [MutationTypes.CLEAR_SUBSCRIPTIONS](state: S): void;
  [MutationTypes.SIGN_OUT](state: S, payload: string[]): void;
  [MutationTypes.SUBSCRIBE](state: S, subscription: Subscriptions): void;
  [MutationTypes.UNSUBSCRIBE](state: S, subsctiption: Subscriptions): void;

  //Coingecko
  [MutationTypes.SET_COINGECKO_ID](state: S, payload: { params: string; value: EmerisAPI.TokenIdResponse }): void;
  [MutationTypes.SET_COINGECKO_ID_STATUS](state: S, payload: { value: LoadingState }): void;
};

export const mutations: MutationTree<APIState> & Mutations = {
  [MutationTypes.SET_BALANCES](state, payload) {
    if (!isEqual(state.balances[payload.params.address], payload.value)) {
      state.balances[payload.params.address] = payload.value;
    }
  },
  [MutationTypes.SET_POOL_BALANCES](state, payload) {
    if (!isEqual(state.balances[payload.params.address], payload.value)) {
      state.balances[payload.params.address] = payload.value;
    }
  },
  [MutationTypes.SET_STAKING_BALANCES](state, payload) {
    if (!isEqual(state.stakingBalances[payload.params.address], payload.value)) {
      state.stakingBalances[payload.params.address] = payload.value;
    }
  },
  [MutationTypes.SET_UNSTAKING_PARAM](state, payload) {
    state.unstakingParams[payload.params.chain_name] = payload.value;
  },
  [MutationTypes.SET_UNBONDING_DELEGATIONS](state, payload) {
    if (!isEqual(state.unbondingDelegations[payload.params.address], payload.value)) {
      state.unbondingDelegations[payload.params.address] = payload.value;
    }
  },
  [MutationTypes.SET_NUMBERS_CHAIN](state, payload) {
    if (!state.chainnumbers[payload.params.chain_name]) {
      state.chainnumbers[payload.params.chain_name] = {};
    }
    if (!isEqual(state.chainnumbers[payload.params.chain_name][payload.params.address], payload.value)) {
      state.chainnumbers[payload.params.chain_name][payload.params.address] = payload.value;
    }
  },
  [MutationTypes.SET_VERIFIED_DENOMS](state, payload) {
    if (!isEqual(state.verifiedDenoms, payload.value)) {
      state.verifiedDenoms = payload.value;
    }
  },
  [MutationTypes.SET_VALID_POOLS](state: APIState, pools: Pool[]) {
    if (!isEqual(state.validPools, pools)) {
      state.validPools = pools;
    }
  },
  [MutationTypes.SET_CHAINS](state, payload) {
    state.chains = {};
    for (const chain of payload.value) {
      if (!isEqual(state.chains[chain.chain_name], chain)) {
        state.chains[chain.chain_name] = chain;
      }
    }
  },
  [MutationTypes.SET_CHAIN_APR](state, payload) {
    const {
      value,
      params: { chain_name },
    } = payload;
    state.chains[chain_name].apr = value;
  },
  [MutationTypes.SET_PRICES](state, payload) {
    state.prices.Fiats = payload.value.Fiats;
    state.prices.Tokens = [
      ...state.prices.Tokens.filter((x) => !payload.value.Tokens.map((x) => x.Symbol).includes(x.Symbol)),
      ...payload.value.Tokens,
    ];
  },
  [MutationTypes.SET_TX_STATUS](state, payload) {
    const ticket = payload.value;
    let txPromise = state.transactions.get(JSON.stringify(payload.params));
    if (txPromise == null) {
      let responseResolve, responseReject;
      const responsePromise: Promise<EmerisAPI.TicketResponse> = new Promise((res, rej) => {
        responseResolve = res;
        responseReject = rej;
      });
      state.transactions.set(JSON.stringify(payload.params), {
        date: Date.now(),
        status: { status: 'pending' },
        resolve: responseResolve,
        reject: responseReject,
        promise: responsePromise,
      });
    }
    txPromise = state.transactions.get(JSON.stringify(payload.params));
    const oldStatus = txPromise.status;
    if (ticket.status != oldStatus.status) {
      txPromise.resolve(ticket);
      if (
        ticket.status == 'complete' ||
        ticket.status == 'failed' ||
        ticket.status == 'IBC_receive_failed' ||
        ticket.status == 'IBC_receive_success' ||
        ticket.status == 'Tokens_unlocked_timeout' ||
        ticket.status == 'Tokens_unlocked_ack' ||
        ticket.status.startsWith('stuck')
      ) {
        state._Subscriptions.delete(
          JSON.stringify({ action: ActionTypes.GET_TX_STATUS, payload: { params: payload.params } }),
        );
      } else {
        let responseResolve, responseReject;
        const responsePromise: Promise<EmerisAPI.TicketResponse> = new Promise((res, rej) => {
          responseResolve = res;
          responseReject = rej;
        });
        state.transactions.set(JSON.stringify(payload.params), {
          date: Date.now(),
          status: ticket,
          resolve: responseResolve,
          reject: responseReject,
          promise: responsePromise,
        });
      }
    } else {
      txPromise.date = Date.now();
      state.transactions.set(JSON.stringify(payload.params), txPromise);
    }
  },
  [MutationTypes.SET_VERIFY_TRACE](state, payload) {
    if (state.traces[payload.params.chain_name]) {
      if (!isEqual(state.traces[payload.params.chain_name][payload.params.hash], payload.value)) {
        state.traces[payload.params.chain_name][payload.params.hash] = payload.value;
      }
    } else {
      state.traces[payload.params.chain_name] = {};
      state.traces[payload.params.chain_name][payload.params.hash] = payload.value;
    }
  },
  [MutationTypes.SET_CHAIN](state, payload) {
    const { status, ...toUpdate } = payload.value;
    if (state.chains[payload.params.chain_name].status == undefined) {
      (toUpdate as EmerisAPI.Chain).status = status;
    }
    if (
      !isEqual(state.chains[payload.params.chain_name], {
        ...state.chains[payload.params.chain_name],
        ...payload.value,
      })
    ) {
      state.chains[payload.params.chain_name] = {
        ...state.chains[payload.params.chain_name],
        ...toUpdate,
      };
    }
  },
  [MutationTypes.SET_IN_PROGRESS](state: APIState, payload: APIPromise) {
    state._InProgess.set(payload.hash, payload.promise);
  },
  [MutationTypes.DELETE_IN_PROGRESS](state: APIState, payload: string) {
    state._InProgess.delete(payload);
  },
  [MutationTypes.SET_TOKEN_PRICES](state, payload) {
    if (payload.value && payload.value.length > 0) {
      const historicalPrices: ChartPrices = payload.value.map((item) => {
        return {
          x: new Date(item[0]).toLocaleString(),
          y: item[1],
        };
      });
      state.tokenPrices = historicalPrices;
      window.dispatchEvent(new Event('resize'));
    } else {
      state.tokenPrices = [];
    }
  },
  [MutationTypes.SET_TOKEN_PRICES_STATUS](state, payload) {
    state.tokenPricesLoadingStatus = payload.value;
  },

  //Airdrops Mutations
  [MutationTypes.SET_AIRDROPS](state, payload) {
    const tempAirdrop = payload.value;

    if (!tempAirdrop.airdropStartDate && !tempAirdrop.airdropEndDate) {
      tempAirdrop.dateStatus = EmerisAirdrops.AirdropDateStatus.NOT_ANNOUNCED;
    } else if (!new Date(tempAirdrop.airdropStartDate).getTime()) {
      tempAirdrop.dateStatus = EmerisAirdrops.AirdropDateStatus.NOT_STARTED;
    } else if (
      new Date(tempAirdrop.airdropStartDate).getTime() <= new Date().getTime() &&
      !new Date(tempAirdrop.airdropEndDate).getTime()
    ) {
      tempAirdrop.dateStatus = EmerisAirdrops.AirdropDateStatus.ONGOING;
    } else if (
      new Date(tempAirdrop.airdropStartDate).getTime() <= new Date().getTime() &&
      new Date(tempAirdrop.airdropEndDate).getTime() > new Date().getTime()
    ) {
      tempAirdrop.dateStatus = EmerisAirdrops.AirdropDateStatus.ONGOING;
    } else if (new Date(tempAirdrop.airdropEndDate).getTime() <= new Date().getTime()) {
      tempAirdrop.dateStatus = EmerisAirdrops.AirdropDateStatus.ENDED;
    }

    state.airdrops.push(tempAirdrop);
  },
  [MutationTypes.SET_AIRDROPS_STATUS](state, payload) {
    state.airdropsStatus = payload.value;
  },
  [MutationTypes.RESET_AIRDROPS](state) {
    state.airdrops = [];
  },

  //Coingecko Mutations
  [MutationTypes.SET_COINGECKO_ID](state, payload) {
    state.coinGeckoId = payload.value.data[payload.params];
  },
  [MutationTypes.SET_COINGECKO_ID_STATUS](state, payload) {
    state.coinGeckoIdLoadingStatus = payload.value;
  },

  [MutationTypes.SET_CHAIN_STATUS](state, payload) {
    if (!isEqual(state.chains[payload.params.chain_name].status, payload.value as boolean)) {
      state.chains[payload.params.chain_name].status = payload.value as boolean;
    }
  },
  [MutationTypes.INIT](state: APIState, payload: DemerisConfig) {
    state.endpoint = payload.endpoint;
    state.gitEndpoint = payload.gitEndpoint;
    state.rawGitEndpoint = payload.rawGitEndpoint;
    state.wsEndpoint = payload.wsEndpoint;
    state.hub_chain = payload.hub_chain;
  },
  [MutationTypes.RESET_STATE](state: APIState) {
    Object.assign(state, getDefaultState());
  },
  [MutationTypes.CLEAR_SUBSCRIPTIONS](state: APIState) {
    for (const sub of state._Subscriptions.values()) {
      const subObj = JSON.parse(sub);
      if (
        subObj.action == ActionTypes.GET_BALANCES ||
        subObj.action == ActionTypes.GET_STAKING_BALANCES ||
        subObj.action == ActionTypes.GET_UNBONDING_DELEGATIONS
      ) {
        state._Subscriptions.delete(sub);
      }
    }
  },
  [MutationTypes.SIGN_OUT](state: APIState, payload: string[]) {
    for (const keyhash of payload ?? []) {
      delete state.balances[keyhash];
      delete state.stakingBalances[keyhash];
      delete state.unbondingDelegations[keyhash];
    }
    state.transactions = new Map();
    state._InProgess = new Map();
  },
  [MutationTypes.SUBSCRIBE](state: APIState, subscription) {
    state._Subscriptions.add(JSON.stringify(subscription));
  },
  [MutationTypes.UNSUBSCRIBE](state: APIState, subscription) {
    state._Subscriptions.delete(JSON.stringify(subscription));
  },
};
