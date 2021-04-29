import { GetterTree } from 'vuex';
import { RootState } from '@/store';
import { State } from './state';
import * as API from '@/types/api';
export type BalanceGetterParams = {
  denom: string;
  key: API.BalanceReq;
};
export type Getters = {
  getBalances(state: State): { (params: API.APIRequests): Array<API.Balance> | null };
  getBalance(state: State): { (params: BalanceGetterParams): API.Balance | null };
  getVerifiedPath(state: State): { (params: API.APIRequests): API.VerifiedPath | null };
  getFeeAddress(state: State): { (params: API.APIRequests): API.FeeAddress | null };
  getFee(state: State): { (params: API.APIRequests): API.Fee | null };
  getFeeToken(state: State): { (params: API.APIRequests): API.FeeToken | null };
  getStakingBalances(state: State): { (params: API.APIRequests): Array<API.StakingBalance> | null };
  getPrices(state: State): Array<API.Price> | null;
  getChains(state: State): Array<API.Chain> | null;
  getVerifiedDenoms(state: State): Array<API.VerifiedDenom> | null;
  getPrimaryChannel(state: State): { (params: API.APIRequests): API.PrimaryChannel | null };
  getChainStatus(state: State): { (params: API.APIRequests): API.ChainStatus | null };
};

export const getters: GetterTree<State, RootState> & Getters = {
  getBalances: state => params => {
    return state.balances[JSON.stringify(params)] ?? null;
  },
  getBalance: state => params => {
    return (
      state.balances[JSON.stringify(params.key)]?.find(x => x.base_denom == params.denom && x.native && x.verified) ??
      null
    );
  },
  getVerifiedPath: state => params => {
    return state.verifiedPath[JSON.stringify(params)] ?? null;
  },
  getFeeAddress: state => params => {
    return state.feeAddress[JSON.stringify(params)] ?? null;
  },
  getFee: state => params => {
    return state.fee[JSON.stringify(params)] ?? null;
  },
  getFeeToken: state => params => {
    return state.feeToken[JSON.stringify(params)] ?? null;
  },
  getStakingBalances: state => params => {
    return state.stakingBalances[JSON.stringify(params)] ?? null;
  },
  getPrices: state => {
    return state.prices ?? null;
  },
  getChains: state => {
    return state.chains ?? null;
  },
  getVerifiedDenoms: state => {
    return state.verifiedDenoms ?? null;
  },
  getPrimaryChannel: state => params => {
    return state.primaryChannel[JSON.stringify(params)] ?? null;
  },
  getChainStatus: state => params => {
    return state.chainStatus[JSON.stringify(params)] ?? null;
  },
};
