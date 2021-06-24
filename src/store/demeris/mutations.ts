import { MutationTree } from 'vuex';

import * as API from '@/types/api';

import { DemerisActionTypes, DemerisSubscriptions } from './action-types';
import { DemerisConfig } from './actions';
import { DemerisMutations, DemerisMutationTypes as MutationTypes, KeplrKeyData } from './mutation-types';
import { getDefaultState, State } from './state';

export type Mutations<S = State> = {
  // Cross-chain endpoint mutations
  [MutationTypes.SET_BALANCES](state: S, payload: { params: API.APIRequests; value: API.Balances }): void;
  [MutationTypes.SET_STAKING_BALANCES](
    state: S,
    payload: { params: API.APIRequests; value: API.StakingBalances },
  ): void;
  [MutationTypes.ADD_KEPLR_KEYHASH](state: S, payload: string): void;
  [MutationTypes.SET_NUMBERS](state: S, payload: { params: API.APIRequests; value: API.Numbers }): void;
  [MutationTypes.SET_FEE_ADDRESSES](state: S, payload: { params: API.APIRequests; value: API.FeeAddresses }): void;
  [MutationTypes.SET_VERIFIED_DENOMS](state: S, payload: { value: API.VerifiedDenoms }): void;
  [MutationTypes.SET_CHAINS](state: S, payload: { value: API.Chains }): void;
  [MutationTypes.SET_PRICES](state: S, payload: { value: any }): void; // TODO: prices
  [MutationTypes.SET_TX_STATUS](state: S, payload: { value: API.Ticket }): void;

  [MutationTypes.SET_KEPLR](state: S, payload: KeplrKeyData): void;
  // Chain-specific endpoint mutations
  [MutationTypes.SET_VERIFY_TRACE](state: S, payload: { params: API.APIRequests; value: API.VerifyTrace }): void;
  [MutationTypes.SET_FEE_ADDRESS](state: S, payload: { params: API.APIRequests; value: API.FeeAddress }): void;
  [MutationTypes.SET_BECH32_CONFIG](state: S, payload: { params: API.APIRequests; value: API.Bech32Config }): void;
  [MutationTypes.SET_CHAIN](state: S, payload: { value: API.Chain }): void;
  [MutationTypes.SET_PRIMARY_CHANNEL](state: S, payload: { params: API.APIRequests; value: API.PrimaryChannel }): void;
  [MutationTypes.SET_PRIMARY_CHANNELS](
    state: S,
    payload: { params: API.APIRequests; value: API.PrimaryChannels },
  ): void;
  [MutationTypes.SET_CHAIN_STATUS](state: S, payload: { params: API.APIRequests; value: boolean }): void;

  // Internal module mutations

  [MutationTypes.INIT](state: S, payload: DemerisConfig): void;
  [MutationTypes.RESET_STATE](state: S): void;
  [MutationTypes.SUBSCRIBE](state: S, subscription: DemerisSubscriptions): void;
  [MutationTypes.UNSUBSCRIBE](state: S, subsctiption: DemerisSubscriptions): void;
};

export const mutations: MutationTree<State> & Mutations = {
  // Cross-chain endpoint mutations
  [MutationTypes.SET_BALANCES](state: State, payload: DemerisMutations) {
    state.balances[(payload.params as API.AddrReq).address] = payload.value as API.Balances;
  },
  [MutationTypes.ADD_KEPLR_KEYHASH](state: State, payload: string) {
    if (state.keplr) state.keplr.keyHashes.push(payload);
  },
  [MutationTypes.SET_STAKING_BALANCES](state: State, payload: DemerisMutations) {
    state.stakingBalances[JSON.stringify(payload.params)] = payload.value as API.StakingBalances;
  },
  [MutationTypes.SET_NUMBERS](state: State, payload: DemerisMutations) {
    state.numbers[(payload.params as API.AddrReq).address] = payload.value as API.Numbers;
  },
  [MutationTypes.SET_FEE_ADDRESSES](state: State, payload: DemerisMutations) {
    for (const feeAddress of payload.value as API.FeeAddresses) {
      state.chains[feeAddress.chain_name].demeris_addresses = [feeAddress.fee_address];
    }
  },
  [MutationTypes.SET_VERIFIED_DENOMS](state: State, payload: DemerisMutations) {
    state.verifiedDenoms = payload.value as API.VerifiedDenoms;
  },
  [MutationTypes.SET_CHAINS](state: State, payload: DemerisMutations) {
    state.chains = {};
    for (const chain of payload.value as API.Chains) {
      state.chains[chain.chain_name] = chain;
    }
  },
  [MutationTypes.SET_PRICES](state: State, payload: DemerisMutations) {
    state.prices = payload.value as any; // TODO: prices
  },
  [MutationTypes.SET_TX_STATUS](state: State, payload: DemerisMutations) {
    const ticket = payload.value as API.Ticket;
    console.log(ticket);
    const txPromise = state.transactions.get(JSON.stringify(payload.params));
    if (txPromise == null) {
      let responseResolve, responseReject;
      const responsePromise: Promise<void> = new Promise((res, rej) => {
        responseResolve = res;
        responseReject = rej;
      });

      state.transactions.set(JSON.stringify(payload.params), {
        date: Date.now(),
        resolve: responseResolve,
        reject: responseReject,
        promise: responsePromise,
      });
    } else {
      if (ticket.status == 'complete') {
        txPromise.resolve();
        state.transactions.delete(JSON.stringify(payload.params));
        console.log({ action: DemerisActionTypes.GET_TX_STATUS, payload: { params: payload.params } });
        state._Subscriptions.delete(
          JSON.stringify({ action: DemerisActionTypes.GET_TX_STATUS, payload: { params: payload.params } }),
        );
      } else if (ticket.status != 'pending' && ticket.status != 'transit') {
        txPromise.reject();
        state.transactions.delete(JSON.stringify(payload.params));
        state._Subscriptions.delete(
          JSON.stringify({ action: DemerisActionTypes.GET_TX_STATUS, payload: { params: payload.params } }),
        );
      }
    }
  },
  [MutationTypes.SET_KEPLR](state: State, payload: KeplrKeyData) {
    state.keplr = payload;
  },

  // Chain-specific endpoint mutations
  [MutationTypes.SET_VERIFY_TRACE](state: State, payload: DemerisMutations) {
    if (state.chains[(payload.params as API.VerifyTraceReq).chain_name].verifiedTraces) {
      state.chains[(payload.params as API.VerifyTraceReq).chain_name].verifiedTraces[
        (payload.params as API.VerifyTraceReq).hash
      ] = payload.value as API.VerifyTrace;
    } else {
      state.chains[(payload.params as API.VerifyTraceReq).chain_name].verifiedTraces = {};
      state.chains[(payload.params as API.VerifyTraceReq).chain_name].verifiedTraces[
        (payload.params as API.VerifyTraceReq).hash
      ] = payload.value as API.VerifyTrace;
    }
  },
  [MutationTypes.SET_FEE_ADDRESS](state: State, payload: DemerisMutations) {
    state.chains[(payload.params as API.ChainReq).chain_name].demeris_addresses = [payload.value as API.FeeAddress];
  },
  [MutationTypes.SET_BECH32_CONFIG](state: State, payload: DemerisMutations) {
    state.chains[(payload.params as API.ChainReq).chain_name].node_info.bech32_config =
      payload.value as API.Bech32Config;
  },
  [MutationTypes.SET_CHAIN](state: State, payload: DemerisMutations) {
    state.chains[(payload.params as API.ChainReq).chain_name] = payload.value as API.Chain;
  },
  [MutationTypes.SET_PRIMARY_CHANNEL](state: State, payload: DemerisMutations) {
    state.chains[(payload.params as API.ChainReq).chain_name].primaryChannels[
      (payload.params as API.ChainReq).destination_chain_name
    ] = payload.value as API.PrimaryChannel;
  },
  [MutationTypes.SET_PRIMARY_CHANNELS](state: State, payload: DemerisMutations) {
    for (const channel of payload.value as API.PrimaryChannels) {
      state.chains[(payload.params as API.ChainReq).chain_name].primaryChannels[channel.counterparty] = channel;
    }
  },
  [MutationTypes.SET_CHAIN_STATUS](state: State, payload: DemerisMutations) {
    state.chains[(payload.params as API.ChainReq).chain_name].status = payload.value as boolean;
  },

  // Internal module mutations

  [MutationTypes.INIT](state: State, payload: DemerisConfig) {
    state.endpoint = payload.endpoint;
  },
  [MutationTypes.RESET_STATE](state: State) {
    Object.assign(state, getDefaultState());
  },
  [MutationTypes.SUBSCRIBE](state: State, subscription) {
    state._Subscriptions.add(JSON.stringify(subscription));
    console.log(state._Subscriptions);
  },
  [MutationTypes.UNSUBSCRIBE](state: State, subscription) {
    state._Subscriptions.delete(JSON.stringify(subscription));
  },
};
