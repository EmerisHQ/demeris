import { MutationTree } from 'vuex';
import * as API from '@/types/api';

import { State,getDefaultState } from './state';
import { DemerisMutationTypes as MutationTypes , DemerisMutations} from './mutation-types';
import { DemerisSubscriptions } from './action-types';

export type Mutations<S = State> = {
  [MutationTypes.SET_BALANCES](state: S, payload: { params: API.APIRequests; value: Array<API.Balance> }): void;
  [MutationTypes.SET_CHAINS](state: S, payload: { value: Array<API.Chain> }): void;
  [MutationTypes.SET_CHAIN_STATUS](state: S, payload: { params: API.APIRequests; value: API.ChainStatus }): void;
  [MutationTypes.SET_FEE](state: S, payload: { params: API.APIRequests; value: API.Fee }): void;
  [MutationTypes.SET_FEE_ADDRESS](state: S, payload: { params: API.APIRequests; value: API.FeeAddress }): void;
  [MutationTypes.SET_FEE_TOKEN](state: S, payload: { params: API.APIRequests; value: API.FeeToken }): void;
  [MutationTypes.SET_PRICES](state: S, payload: { value: Array<API.Price>}): void;
  [MutationTypes.SET_PRIMARY_CHANNEL](state: S, payload: { params: API.APIRequests; value: API.PrimaryChannel }): void;
  [MutationTypes.SET_STAKING_BALANCES](state: S, payload: { params: API.APIRequests; value: Array<API.StakingBalance> }): void;
  [MutationTypes.SET_VERIFIED_DENOMS](state: S, payload: { value: Array<API.VerifiedDenom>}): void;
  [MutationTypes.SET_VERIFIED_PATH](state: S, payload: {params: API.APIRequests; value: API.VerifiedPath}): void;
  [MutationTypes.RESET_STATE](state: S): void;
  [MutationTypes.SUBSCRIBE](state: S, subscription: DemerisSubscriptions): void;
  [MutationTypes.UNSUBSCRIBE](state: S, subsctiption: DemerisSubscriptions): void;
};

export const mutations: MutationTree<State> & Mutations = {
  [MutationTypes.SET_BALANCES](state: State, payload: DemerisMutations) {
		state.balances[JSON.stringify(payload.params)]=payload.value as Array<API.Balance>;    
  },
	[MutationTypes.SET_CHAINS](state: State, payload: DemerisMutations) {
		state.chains=payload.value as Array<API.Chain>  
  },
  [MutationTypes.SET_CHAIN_STATUS](state: State, payload: DemerisMutations) {
		state.chainStatus[JSON.stringify(payload.params)]=payload.value as API.ChainStatus;    
  },
  [MutationTypes.SET_FEE](state: State, payload: DemerisMutations) {
		state.fee[JSON.stringify(payload.params)]=payload.value as API.Fee;    
  },
  [MutationTypes.SET_FEE_ADDRESS](state: State, payload: DemerisMutations) {
		state.feeAddress[JSON.stringify(payload.params)]=payload.value as API.FeeAddress;    
  },
  [MutationTypes.SET_FEE_TOKEN](state: State, payload: DemerisMutations) {
		state.feeToken[JSON.stringify(payload.params)]=payload.value as API.FeeToken;    
  },
  [MutationTypes.SET_PRICES](state: State, payload: DemerisMutations) {
		state.prices=payload.value as Array<API.Price>;    
  },
  [MutationTypes.SET_PRIMARY_CHANNEL](state: State, payload: DemerisMutations) {
		state.primaryChannel[JSON.stringify(payload.params)]=payload.value as API.PrimaryChannel;    
  },
  [MutationTypes.SET_STAKING_BALANCES](state: State, payload: DemerisMutations) {
		state.stakingBalances[JSON.stringify(payload.params)]=payload.value as Array<API.StakingBalance>;    
  },
  [MutationTypes.SET_VERIFIED_DENOMS](state: State, payload: DemerisMutations) {
		state.verifiedDenoms=payload.value as Array<API.VerifiedDenom>;    
  },
  [MutationTypes.SET_VERIFIED_PATH](state: State, payload: DemerisMutations) {
		state.verifiedPath[JSON.stringify(payload.params)]=payload.value as API.VerifiedPath;    
  },
  [MutationTypes.RESET_STATE](state: State) {
		Object.assign(state, getDefaultState())
  },
  [MutationTypes.SUBSCRIBE](state: State, subscription) {
		state._Subscriptions.add(subscription)
  },
  [MutationTypes.UNSUBSCRIBE](state: State, subscription) {
		state._Subscriptions.delete(subscription)
  },
};
