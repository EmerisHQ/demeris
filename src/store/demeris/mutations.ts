import { MutationTree } from 'vuex';
import * as API from '@/types/api';

import { State, getDefaultState } from './state';
import { DemerisMutationTypes as MutationTypes, DemerisMutations } from './mutation-types';
import { DemerisSubscriptions } from './action-types';

export type Mutations<S = State> = {
  // Cross-chain endpoint mutations
  [MutationTypes.SET_BALANCES](state: S, payload: { params: API.APIRequests; value: API.Balances }): void;
  [MutationTypes.SET_STAKING_BALANCES](
    state: S,
    payload: { params: API.APIRequests; value: API.StakingBalances },
  ): void;

  [MutationTypes.SET_FEE_ADDRESSES](state: S, payload: { params: API.APIRequests; value: API.FeeAddresses }): void;
  [MutationTypes.SET_VERIFIED_DENOMS](state: S, payload: { value: API.VerifiedDenoms }): void;
  [MutationTypes.SET_CHAINS](state: S, payload: { value: API.Chains }): void;
  [MutationTypes.SET_PRICES](state: S, payload: { value: any }): void; // TODO: prices

  // Chain-specific endpoint mutations
  [MutationTypes.SET_VERIFY_TRACE](state: S, payload: { params: API.APIRequests; value: API.VerifyTrace }): void;
  [MutationTypes.SET_FEE_ADDRESS](state: S, payload: { params: API.APIRequests; value: API.FeeAddress }): void;
  [MutationTypes.SET_BECH32_CONFIG](state: S, payload: { params: API.APIRequests; value: API.Bech32Config }): void;
  [MutationTypes.SET_FEE](state: S, payload: { params: API.APIRequests; value: API.Fee }): void;
  [MutationTypes.SET_FEE_TOKENS](state: S, payload: { params: API.APIRequests; value: API.FeeTokens }): void;
  [MutationTypes.SET_CHAIN](state: S, payload: { value: API.Chain }): void;
  [MutationTypes.SET_PRIMARY_CHANNEL](state: S, payload: { params: API.APIRequests; value: API.PrimaryChannel }): void;
  [MutationTypes.SET_PRIMARY_CHANNELS](
    state: S,
    payload: { params: API.APIRequests; value: API.PrimaryChannels },
  ): void;
  [MutationTypes.SET_CHAIN_STATUS](state: S, payload: { params: API.APIRequests; value: any }): void; // TODO: chain status

  // Internal module mutations

  [MutationTypes.RESET_STATE](state: S): void;
  [MutationTypes.SUBSCRIBE](state: S, subscription: DemerisSubscriptions): void;
  [MutationTypes.UNSUBSCRIBE](state: S, subsctiption: DemerisSubscriptions): void;
};

export const mutations: MutationTree<State> & Mutations = {
  // Cross-chain endpoint mutations
  [MutationTypes.SET_BALANCES](state: State, payload: DemerisMutations) {
    state.balances[JSON.stringify(payload.params)] = payload.value as API.Balances;
  },
  [MutationTypes.SET_STAKING_BALANCES](state: State, payload: DemerisMutations) {
    state.stakingBalances[JSON.stringify(payload.params)] = payload.value as API.StakingBalances;
  },
  [MutationTypes.SET_FEE_ADDRESSES](state: State, payload: DemerisMutations) {
    for (const feeAddress of payload.value as API.FeeAddresses) {
      state.chains[feeAddress.chain_name].fee_address = feeAddress.fee_address;
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

  // Chain-specific endpoint mutations
  [MutationTypes.SET_VERIFY_TRACE](state: State, payload: DemerisMutations) {
    state.chains[(payload.params as API.VerifyTraceReq).chain_name].verifiedTraces[
      (payload.params as API.VerifyTraceReq).hash
    ] = payload.value as API.VerifyTrace;
  },
  [MutationTypes.SET_FEE_ADDRESS](state: State, payload: DemerisMutations) {
    state.chains[(payload.params as API.ChainReq).chain_name].fee_address = payload.value as API.FeeAddress;
  },
  [MutationTypes.SET_BECH32_CONFIG](state: State, payload: DemerisMutations) {
    state.chains[
      (payload.params as API.ChainReq).chain_name
    ].node_info.bech32_config = payload.value as API.Bech32Config;
  },
  [MutationTypes.SET_FEE](state: State, payload: DemerisMutations) {
    state.chains[(payload.params as API.ChainReq).chain_name].base_ibc_fee = payload.value as API.Fee; // TODO: Change after MVP
    state.chains[(payload.params as API.ChainReq).chain_name].base_fee = payload.value as API.Fee;
  },
  [MutationTypes.SET_FEE_TOKENS](state: State, payload: DemerisMutations) {
    state.chains[(payload.params as API.ChainReq).chain_name].fee_tokens = payload.value as API.FeeTokens;
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
    state.chains[(payload.params as API.ChainReq).chain_name].status = payload.value as any; // TODO: chain status
  },

  // Internal module mutations

  [MutationTypes.RESET_STATE](state: State) {
    Object.assign(state, getDefaultState());
  },
  [MutationTypes.SUBSCRIBE](state: State, subscription) {
    state._Subscriptions.add(subscription);
  },
  [MutationTypes.UNSUBSCRIBE](state: State, subscription) {
    state._Subscriptions.delete(subscription);
  },
};
