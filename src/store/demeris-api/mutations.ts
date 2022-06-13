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

export const mutations: MutationTree<APIState> = {
  [MutationTypes.SET_BALANCES](
    state: APIState,
    payload: { params: EmerisAPI.AddrReq; value: EmerisAPI.Balances },
  ): void {
    if (!isEqual(state.balances[payload.params.address], payload.value)) {
      state.balances[payload.params.address] = payload.value;
    }
  },
  [MutationTypes.SET_POOL_BALANCES](
    state: APIState,
    payload: { params: EmerisAPI.AddrReq; value: EmerisAPI.Balances },
  ): void {
    if (!isEqual(state.balances[payload.params.address], payload.value)) {
      state.balances[payload.params.address] = payload.value;
    }
  },
  [MutationTypes.SET_STAKING_BALANCES](
    state: APIState,
    payload: { params: EmerisAPI.AddrReq; value: EmerisAPI.StakingBalances },
  ): void {
    if (!isEqual(state.stakingBalances[payload.params.address], payload.value)) {
      state.stakingBalances[payload.params.address] = payload.value;
    }
  },
  [MutationTypes.SET_UNSTAKING_PARAM](
    state: APIState,
    payload: { params: EmerisAPI.ChainReq; value: EmerisAPI.StakingParams },
  ): void {
    state.unstakingParams[payload.params.chain_name] = payload.value;
  },
  [MutationTypes.SET_UNBONDING_DELEGATIONS](
    state: APIState,
    payload: { params: EmerisAPI.AddrReq; value: EmerisAPI.UnbondingDelegations },
  ): void {
    if (!isEqual(state.unbondingDelegations[payload.params.address], payload.value)) {
      state.unbondingDelegations[payload.params.address] = payload.value;
    }
  },
  [MutationTypes.SET_NUMBERS_CHAIN](
    state: APIState,
    payload: { params: EmerisAPI.ChainAddrReq; value: EmerisAPI.SeqNumber },
  ): void {
    if (!state.chainnumbers[payload.params.chain_name]) {
      state.chainnumbers[payload.params.chain_name] = {};
    }
    if (!isEqual(state.chainnumbers[payload.params.chain_name][payload.params.address], payload.value)) {
      state.chainnumbers[payload.params.chain_name][payload.params.address] = payload.value;
    }
  },
  [MutationTypes.SET_VERIFIED_DENOMS](state: APIState, payload: { value: EmerisAPI.VerifiedDenoms }): void {
    if (!isEqual(state.verifiedDenoms, payload.value)) {
      state.verifiedDenoms = payload.value;
    }
  },
  [MutationTypes.SET_VALID_POOLS](state: APIState, pools: Pool[]): void {
    if (!isEqual(state.validPools, pools)) {
      state.validPools = pools;
    }
  },
  [MutationTypes.SET_CHAINS](state: APIState, payload: { value: EmerisAPI.SupportedChain[] }): void {
    state.chains = {};
    for (const chain of payload.value) {
      if (!isEqual(state.chains[chain.chain_name], chain)) {
        state.chains[chain.chain_name] = chain;
      }
    }
  },
  [MutationTypes.SET_CHAIN_APR](state: APIState, payload: { params: EmerisAPI.ChainReq; value: string }): void {
    const {
      value,
      params: { chain_name },
    } = payload;
    state.chains[chain_name].apr = value;
  },
  [MutationTypes.SET_PRICES](state: APIState, payload: { value: EmerisAPI.Prices }): void {
    state.prices.Fiats = payload.value.Fiats;
    state.prices.Tokens = [
      ...state.prices.Tokens.filter((x) => !payload.value.Tokens.map((x) => x.Symbol).includes(x.Symbol)),
      ...payload.value.Tokens,
    ];
  },
  [MutationTypes.SET_TX_STATUS](
    state: APIState,
    payload: { params: EmerisAPI.TicketReq; value: EmerisAPI.TicketResponse },
  ): void {
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
  [MutationTypes.SET_VERIFY_TRACE](
    state: APIState,
    payload: { params: EmerisAPI.VerifyTraceReq; value: EmerisAPI.VerifyTrace },
  ): void {
    if (state.traces[payload.params.chain_name]) {
      if (!isEqual(state.traces[payload.params.chain_name][payload.params.hash], payload.value)) {
        state.traces[payload.params.chain_name][payload.params.hash] = payload.value;
      }
    } else {
      state.traces[payload.params.chain_name] = {};
      state.traces[payload.params.chain_name][payload.params.hash] = payload.value;
    }
  },
  [MutationTypes.SET_CHAIN](state: APIState, payload: { params: EmerisAPI.ChainReq; value: EmerisAPI.Chain }): void {
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
  [MutationTypes.SET_IN_PROGRESS](state: APIState, payload: APIPromise): void {
    state._InProgess.set(payload.hash, payload.promise);
  },
  [MutationTypes.DELETE_IN_PROGRESS](state: APIState, payload: string): void {
    state._InProgess.delete(payload);
  },
  [MutationTypes.SET_TOKEN_PRICES](state: APIState, payload: { value: Array<[number, number]> }): void {
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
  [MutationTypes.SET_TOKEN_PRICES_STATUS](state: APIState, payload: { value: LoadingState }): void {
    state.tokenPricesLoadingStatus = payload.value;
  },

  //Airdrops Mutations
  [MutationTypes.SET_AIRDROPS](state: APIState, payload: { value: EmerisAirdrops.Airdrop }): void {
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
  [MutationTypes.SET_AIRDROPS_STATUS](state: APIState, payload: { value: LoadingState }) {
    state.airdropsStatus = payload.value;
  },
  [MutationTypes.RESET_AIRDROPS](state: APIState): void {
    state.airdrops = [];
  },

  //Coingecko Mutations
  [MutationTypes.SET_COINGECKO_ID](
    state: APIState,
    payload: { params: string; value: EmerisAPI.TokenIdResponse },
  ): void {
    state.coinGeckoId = payload.value.data[payload.params];
  },
  [MutationTypes.SET_COINGECKO_ID_STATUS](state: APIState, payload: { value: LoadingState }): void {
    state.coinGeckoIdLoadingStatus = payload.value;
  },

  [MutationTypes.SET_CHAIN_STATUS](state: APIState, payload: { params: EmerisAPI.ChainReq; value: boolean }): void {
    if (!isEqual(state.chains[payload.params.chain_name].status, payload.value as boolean)) {
      state.chains[payload.params.chain_name].status = payload.value as boolean;
    }
  },
  [MutationTypes.INIT](state: APIState, payload: DemerisConfig): void {
    state.endpoint = payload.endpoint;
    state.gitEndpoint = payload.gitEndpoint;
    state.rawGitEndpoint = payload.rawGitEndpoint;
    state.wsEndpoint = payload.wsEndpoint;
    state.hub_chain = payload.hub_chain;
  },
  [MutationTypes.RESET_STATE](state: APIState): void {
    Object.assign(state, getDefaultState());
  },
  [MutationTypes.CLEAR_SUBSCRIPTIONS](state: APIState): void {
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
  [MutationTypes.SIGN_OUT](state: APIState, payload: string[]): void {
    for (const keyhash of payload ?? []) {
      delete state.balances[keyhash];
    }
    state.stakingBalances = {};
    state.unbondingDelegations = {};
    state.transactions = new Map();
    state._InProgess = new Map();
  },
  [MutationTypes.SUBSCRIBE](state: APIState, subscription: Subscriptions): void {
    state._Subscriptions.add(JSON.stringify(subscription));
  },
  [MutationTypes.UNSUBSCRIBE](state: APIState, subscription: Subscriptions): void {
    state._Subscriptions.delete(JSON.stringify(subscription));
  },
};
