import { GetterTree } from 'vuex';
import { RootState } from '@/store';
import { State } from './state';
import * as API from '@/types/api';


export type Getters = {
  getBalances(state: State): {(params: API.APIRequests):Array<API.Balance>};
	getVerifiedPath(state: State): {(params: API.APIRequests):API.VerifiedPath};
	getFeeAddress(state: State): {(params: API.APIRequests):API.FeeAddress};
	getFee(state: State): {(params: API.APIRequests):API.Fee};
	getFeeToken(state: State): {(params: API.APIRequests):API.FeeToken};
	getStakingBalances(state: State): {(params: API.APIRequests):Array<API.StakingBalance>};
	getPrices(state: State):Array<API.Price>;
	getChains(state: State):Array<API.Chain>;
	getVerifiedDenoms(state: State):Array<API.VerifiedDenom>;
	getPrimaryChannel(state: State): {(params: API.APIRequests):API.PrimaryChannel};
	getChainStatus(state: State): {(params: API.APIRequests):API.ChainStatus};
}

export const getters: GetterTree<State, RootState> & Getters = {
  getBalances: (state) => (params) => {
		return state.balances[JSON.stringify(params)] ?? [];
	},
	getVerifiedPath: (state) => (params) => {
		return state.verifiedPath[JSON.stringify(params)] ?? {} as API.IBCDetails;
	},
	getFeeAddress: (state) => (params) => {
		return state.feeAddress[JSON.stringify(params)] ?? {} as API.FeeAddress;
	},
	getFee: (state) => (params) => {
		return state.fee[JSON.stringify(params)] ?? {} as API.Fee;
	},
	getFeeToken: (state) => (params) => {
		return state.feeToken[JSON.stringify(params)] ?? {} as API.FeeToken;
	},
  getStakingBalances: (state) => (params) => {
		return state.stakingBalances[JSON.stringify(params)] ?? [];
	},
  getPrices: (state) => {
		return state.prices;
	},
  getChains: (state) => {
		return state.chains;
	},
  getVerifiedDenoms: (state) => {
		return state.verifiedDenoms;
	},
  getPrimaryChannel: (state) => (params) => {
		return state.primaryChannel[JSON.stringify(params)] ?? {} as API.PrimaryChannel;
	},
  getChainStatus: (state) => (params) => {
		return state.chainStatus[JSON.stringify(params)] ?? {} as API.ChainStatus;
	},
	
};

