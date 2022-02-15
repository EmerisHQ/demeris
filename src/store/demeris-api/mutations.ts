import isEqual from 'lodash.isequal';
import { MutationTree } from 'vuex';

import { Pool } from '@/types/actions';
import * as API from '@/types/api';

import { DemerisActionTypes, DemerisSubscriptions } from './action-types';
import { DemerisConfig } from './actions';
import { APIPromise, DemerisMutations, DemerisMutationTypes as MutationTypes } from './mutation-types';
import { ChainData, getDefaultState, State } from './state';

export type Mutations<S = State> = {
  [MutationTypes.SET_BALANCES](state: S, payload: { params: API.APIRequests; value: API.Balances }): void;
  [MutationTypes.SET_POOL_BALANCES](state: S, payload: { params: API.APIRequests; value: API.Balances }): void;
  [MutationTypes.SET_STAKING_BALANCES](
    state: S,
    payload: { params: API.APIRequests; value: API.StakingBalances },
  ): void;
  [MutationTypes.SET_NUMBERS](state: S, payload: { params: API.APIRequests; value: API.Numbers }): void;
  [MutationTypes.SET_NUMBERS_CHAIN](state: S, payload: { params: API.APIRequests; value: API.SeqNumber }): void;
  [MutationTypes.SET_FEE_ADDRESSES](state: S, payload: { params: API.APIRequests; value: API.FeeAddresses }): void;
  [MutationTypes.SET_VERIFIED_DENOMS](state: S, payload: { value: API.VerifiedDenoms }): void;
  [MutationTypes.SET_VALID_POOLS](state: S, payload: Pool[]): void;
  [MutationTypes.SET_CHAINS](state: S, payload: { value: API.Chains }): void;
  [MutationTypes.SET_PRICES](state: S, payload: { value: API.Prices }): void;
  [MutationTypes.SET_TX_STATUS](state: S, payload: { value: API.Ticket }): void;

  [MutationTypes.SET_VERIFY_TRACE](state: S, payload: { params: API.APIRequests; value: API.VerifyTrace }): void;
  [MutationTypes.SET_FEE_ADDRESS](state: S, payload: { params: API.APIRequests; value: API.FeeAddress }): void;
  [MutationTypes.SET_BECH32_CONFIG](state: S, payload: { params: API.APIRequests; value: API.Bech32Config }): void;
  [MutationTypes.SET_CHAIN](state: S, payload: { value: ChainData }): void;
  [MutationTypes.SET_PRIMARY_CHANNEL](state: S, payload: { params: API.APIRequests; value: API.PrimaryChannel }): void;
  [MutationTypes.SET_PRIMARY_CHANNELS](
    state: S,
    payload: { params: API.APIRequests; value: API.PrimaryChannels },
  ): void;
  [MutationTypes.SET_TOKEN_PRICES](state: S, payload: { params: API.APIRequests; value: any[] }): void;
  [MutationTypes.SET_TOKEN_PRICES_STATUS](
    state: S,
    payload: { params: API.APIRequests; value: API.LoadingState },
  ): void;
  [MutationTypes.SET_TOKEN_ID](state: S, payload: { value: API.TokenId }): void;
  [MutationTypes.SET_CHAIN_STATUS](state: S, payload: { params: API.APIRequests; value: boolean }): void;

  [MutationTypes.INIT](state: S, payload: DemerisConfig): void;
  [MutationTypes.SET_IN_PROGRESS](state: S, payload: APIPromise): void;
  [MutationTypes.DELETE_IN_PROGRESS](state: S, payload: string): void;
  [MutationTypes.RESET_STATE](state: S): void;
  [MutationTypes.SIGN_OUT](state: S, payload: string[]): void;
  [MutationTypes.SUBSCRIBE](state: S, subscription: DemerisSubscriptions): void;
  [MutationTypes.UNSUBSCRIBE](state: S, subsctiption: DemerisSubscriptions): void;
};

export const mutations: MutationTree<State> & Mutations = {
  [MutationTypes.SET_BALANCES](state: State, payload: DemerisMutations) {
    if (!isEqual(state.balances[(payload.params as API.AddrReq).address], payload.value as API.Balances)) {
      state.balances[(payload.params as API.AddrReq).address] = payload.value as API.Balances;
    }
  },
  [MutationTypes.SET_POOL_BALANCES](state: State, payload: DemerisMutations) {
    if (!isEqual(state.balances[(payload.params as API.AddrReq).address], payload.value as API.Balances)) {
      state.balances[(payload.params as API.AddrReq).address] = payload.value as API.Balances;
    }
  },
  [MutationTypes.SET_STAKING_BALANCES](state: State, payload: DemerisMutations) {
    if (!isEqual(state.stakingBalances[JSON.stringify(payload.params)], payload.value as API.StakingBalances)) {
      state.stakingBalances[JSON.stringify(payload.params)] = payload.value as API.StakingBalances;
    }
  },
  [MutationTypes.SET_NUMBERS](state: State, payload: DemerisMutations) {
    if (!isEqual(state.numbers[(payload.params as API.AddrReq).address], payload.value as API.Numbers)) {
      state.numbers[(payload.params as API.AddrReq).address] = payload.value as API.Numbers;
    }
  },
  [MutationTypes.SET_NUMBERS_CHAIN](state: State, payload: DemerisMutations) {
    if (!state.chainnumbers[(payload.params as API.ChainAddrReq).chain_name]) {
      state.chainnumbers[(payload.params as API.ChainAddrReq).chain_name] = {};
    }
    if (
      !isEqual(
        state.chainnumbers[(payload.params as API.ChainAddrReq).chain_name][
          (payload.params as API.ChainAddrReq).address
        ],
        payload.value as API.SeqNumber,
      )
    ) {
      state.chainnumbers[(payload.params as API.ChainAddrReq).chain_name][
        (payload.params as API.ChainAddrReq).address
      ] = payload.value as API.SeqNumber;
    }
  },
  [MutationTypes.SET_FEE_ADDRESSES](state: State, payload: DemerisMutations) {
    for (const feeAddress of payload.value as API.FeeAddresses) {
      if (!isEqual(state.chains[feeAddress.chain_name].demeris_addresses, [feeAddress.fee_address])) {
        state.chains[feeAddress.chain_name].demeris_addresses = [feeAddress.fee_address];
      }
    }
  },
  [MutationTypes.SET_VERIFIED_DENOMS](state: State, payload: DemerisMutations) {
    if (!isEqual(state.verifiedDenoms, payload.value as API.VerifiedDenoms)) {
      state.verifiedDenoms = payload.value as API.VerifiedDenoms;
    }
  },
  [MutationTypes.SET_VALID_POOLS](state: State, pools: Pool[]) {
    if (!isEqual(state.validPools, pools)) {
      state.validPools = pools;
    }
  },
  [MutationTypes.SET_CHAINS](state: State, payload: DemerisMutations) {
    state.chains = {};
    for (const chain of payload.value as API.Chains) {
      if (!isEqual(state.chains[chain.chain_name], chain)) {
        state.chains[chain.chain_name] = chain;
      }
    }
  },
  [MutationTypes.SET_PRICES](state: State, payload: DemerisMutations) {
    state.prices.Fiats = (payload.value as API.Prices).Fiats;
    state.prices.Tokens = [
      ...state.prices.Tokens.filter(
        (x) => !(payload.value as API.Prices).Tokens.map((x) => x.Symbol).includes(x.Symbol),
      ),
      ...(payload.value as API.Prices).Tokens,
    ];
  },
  [MutationTypes.SET_TX_STATUS](state: State, payload: DemerisMutations) {
    const ticket = payload.value as API.Ticket;
    let txPromise = state.transactions.get(JSON.stringify(payload.params));
    if (txPromise == null) {
      let responseResolve, responseReject;
      const responsePromise: Promise<API.Ticket> = new Promise((res, rej) => {
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
          JSON.stringify({ action: DemerisActionTypes.GET_TX_STATUS, payload: { params: payload.params } }),
        );
      } else {
        let responseResolve, responseReject;
        const responsePromise: Promise<API.Ticket> = new Promise((res, rej) => {
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
  [MutationTypes.SET_VERIFY_TRACE](state: State, payload: DemerisMutations) {
    if (state.chains[(payload.params as API.VerifyTraceReq).chain_name].verifiedTraces) {
      if (
        !isEqual(
          state.chains[(payload.params as API.VerifyTraceReq).chain_name].verifiedTraces[
            (payload.params as API.VerifyTraceReq).hash
          ],
          payload.value as API.VerifyTrace,
        )
      ) {
        state.chains[(payload.params as API.VerifyTraceReq).chain_name].verifiedTraces[
          (payload.params as API.VerifyTraceReq).hash
        ] = payload.value as API.VerifyTrace;
      }
    } else {
      state.chains[(payload.params as API.VerifyTraceReq).chain_name].verifiedTraces = {};
      state.chains[(payload.params as API.VerifyTraceReq).chain_name].verifiedTraces[
        (payload.params as API.VerifyTraceReq).hash
      ] = payload.value as API.VerifyTrace;
    }
  },
  [MutationTypes.SET_FEE_ADDRESS](state: State, payload: DemerisMutations) {
    if (
      !isEqual(state.chains[(payload.params as API.ChainReq).chain_name].demeris_addresses, [
        payload.value as API.FeeAddress,
      ])
    ) {
      state.chains[(payload.params as API.ChainReq).chain_name].demeris_addresses = [payload.value as API.FeeAddress];
    }
  },
  [MutationTypes.SET_BECH32_CONFIG](state: State, payload: DemerisMutations) {
    if (
      !isEqual(
        state.chains[(payload.params as API.ChainReq).chain_name].node_info.bech32_config,
        payload.value as API.Bech32Config,
      )
    ) {
      state.chains[(payload.params as API.ChainReq).chain_name].node_info.bech32_config =
        payload.value as API.Bech32Config;
    }
  },
  [MutationTypes.SET_CHAIN](state: State, payload: DemerisMutations) {
    const { status, ...toUpdate } = payload.value as ChainData;
    if (!state.chains[(payload.params as API.ChainReq).chain_name].status) {
      (toUpdate as ChainData).status = status;
    }
    if (
      !isEqual(state.chains[(payload.params as API.ChainReq).chain_name], {
        ...state.chains[(payload.params as API.ChainReq).chain_name],
        ...(payload.value as ChainData),
        relayerBalance: { address: ``, chain_name: (payload.params as API.ChainReq).chain_name, enough_balance: false },
      })
    ) {
      state.chains[(payload.params as API.ChainReq).chain_name] = {
        ...state.chains[(payload.params as API.ChainReq).chain_name],
        ...toUpdate,
        relayerBalance: { address: '', chain_name: (payload.params as API.ChainReq).chain_name, enough_balance: false },
      };
    }
  },
  [MutationTypes.SET_IN_PROGRESS](state: State, payload: APIPromise) {
    state._InProgess.set(payload.hash, payload.promise);
  },
  [MutationTypes.DELETE_IN_PROGRESS](state: State, payload: string) {
    state._InProgess.delete(payload);
  },
  [MutationTypes.SET_PRIMARY_CHANNEL](state: State, payload: DemerisMutations) {
    if (
      !isEqual(
        state.chains[(payload.params as API.ChainReq).chain_name].primaryChannels[
          (payload.params as API.ChainReq).destination_chain_name
        ],
        payload.value as API.PrimaryChannel,
      )
    ) {
      state.chains[(payload.params as API.ChainReq).chain_name].primaryChannels[
        (payload.params as API.ChainReq).destination_chain_name
      ] = payload.value as API.PrimaryChannel;
    }
  },
  [MutationTypes.SET_PRIMARY_CHANNELS](state: State, payload: DemerisMutations) {
    for (const channel of payload.value as API.PrimaryChannels) {
      if (
        !isEqual(
          state.chains[(payload.params as API.ChainReq).chain_name].primaryChannels[channel.counterparty],
          channel,
        )
      ) {
        state.chains[(payload.params as API.ChainReq).chain_name].primaryChannels[channel.counterparty] = channel;
      }
    }
  },
  [MutationTypes.SET_TOKEN_PRICES](state: State, payload: DemerisMutations) {
    const newPayload: any = payload.value;
    if (newPayload.data) {
      const historicalPrices: API.TokenPrices[] = newPayload.data.prices.map((item) => {
        return {
          x: new Date(item[0]).toLocaleString(),
          y: item[1],
        };
      });
      state.tokenPrices = historicalPrices;
    } else {
      state.tokenPrices = [];
    }
  },
  [MutationTypes.SET_TOKEN_PRICES_STATUS](state: State, payload: DemerisMutations) {
    state.tokenPricesLoadingStatus = payload.value as API.LoadingState;
  },
  [MutationTypes.SET_TOKEN_ID](state: State, payload: DemerisMutations) {
    const newPayload: any = payload.value;
    state.tokenId = newPayload.data[newPayload.token];
  },
  [MutationTypes.SET_TOKEN_ID_STATUS](state: State, payload: DemerisMutations) {
    state.tokenIdLoadingStatus = payload.value as API.LoadingState;
  },
  [MutationTypes.SET_CHAIN_STATUS](state: State, payload: DemerisMutations) {
    if (!isEqual(state.chains[(payload.params as API.ChainReq).chain_name].status, payload.value as boolean)) {
      state.chains[(payload.params as API.ChainReq).chain_name].status = payload.value as boolean;
    }
  },
  [MutationTypes.SET_RELAYER_STATUS](state: State, payload: DemerisMutations) {
    state.relayer = payload.value as boolean;
  },

  [MutationTypes.SET_RELAYER_BALANCES](state: State, payload: DemerisMutations) {
    const chains = Object.values(state.chains);
    for (const relayerBalance of payload.value as API.RelayerBalances) {
      const chain_name = chains.find((x) => x.node_info.chain_id == relayerBalance.chain_name).chain_name;
      if (!isEqual(state.chains[chain_name].relayerBalance, relayerBalance)) {
        state.chains[chain_name].relayerBalance = relayerBalance;
      }
    }
  },
  [MutationTypes.INIT](state: State, payload: DemerisConfig) {
    state.endpoint = payload.endpoint;
    state.hub_chain = payload.hub_chain;
  },
  [MutationTypes.RESET_STATE](state: State) {
    Object.assign(state, getDefaultState());
  },
  [MutationTypes.SIGN_OUT](state: State, payload: string[]) {
    for (const sub of state._Subscriptions.values()) {
      const subObj = JSON.parse(sub);
      if (
        subObj.action == DemerisActionTypes.GET_BALANCES ||
        subObj.action == DemerisActionTypes.GET_STAKING_BALANCES ||
        subObj.action == DemerisActionTypes.GET_NUMBERS
      ) {
        state._Subscriptions.delete(sub);
      }
    }
    for (const keyhash of payload ?? []) {
      delete state.balances[keyhash];
    }
    state.stakingBalances = {};
    state.numbers = {};
    state.transactions = new Map();
    state._InProgess = new Map();
  },
  [MutationTypes.SUBSCRIBE](state: State, subscription) {
    state._Subscriptions.add(JSON.stringify(subscription));
  },
  [MutationTypes.UNSUBSCRIBE](state: State, subscription) {
    state._Subscriptions.delete(JSON.stringify(subscription));
  },
};
