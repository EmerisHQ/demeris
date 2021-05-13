import { GetterTree } from 'vuex';
import { RootState } from '@/store';
import { State, ChainData } from './state';
import * as API from '@/types/api';

export type Getters = {
  getBalances(state: State): { (params: API.APIRequests): API.Balances };
  getStakingBalances(state: State): { (params: API.APIRequests): API.StakingBalances };
  getNumbers(state: State): { (params: API.APIRequests): API.Numbers };
  getFeeAddresses(state: State): API.FeeAddresses;
  getVerifiedDenoms(state: State): API.VerifiedDenoms;
  getChains(state: State): Record<string, ChainData>;
  getPrices(state: State): any; //TODO prices

  getVerifyTrace(state: State): { (params: API.APIRequests): API.VerifyTrace };
  getFeeAddress(state: State): { (params: API.APIRequests): API.FeeAddress };
  getBech32Config(state: State): { (params: API.APIRequests): API.Bech32Config };
  getFee(state: State): { (params: API.APIRequests): API.Fee };
  getBaseFee(state: State): { (params: API.APIRequests): API.Fee };
  getIBCFee(state: State): { (params: API.APIRequests): API.Fee };
  getFeeTokens(state: State): { (params: API.APIRequests): API.FeeTokens };
  getChain(state: State): { (params: API.APIRequests): ChainData };
  getPrimaryChannel(state: State): { (params: API.APIRequests): API.PrimaryChannel };
  getPrimaryChannels(state: State): { (params: API.APIRequests): API.PrimaryChannels };
  getChainStatus(state: State): { (params: API.APIRequests): any }; // TODO chain status
};

export const getters: GetterTree<State, RootState> & Getters = {
  getBalances: state => params => {
    return state.balances[(params as API.AddrReq).address] ?? [];
  },
  getStakingBalances: state => params => {
    return state.stakingBalances[(params as API.AddrReq).address] ?? [];
  },
  getNumbers: state => params => {
    return state.numbers[(params as API.AddrReq).address] ?? [];
  },
  getFeeAddresses: state => {
    const feeAddresses = [];
    for (const chain of Object.values(state.chains)) {
      feeAddresses.push({ chain_name: chain.base_fee, fee_address: chain.fee_address });
    }
    return feeAddresses;
  },
  getVerifiedDenoms: state => {
    return state.verifiedDenoms;
  },
  getChains: state => {
    return state.chains;
  },
  getPrices: state => {
    return state.prices; //TODO: Prices
  },
  getVerifyTrace: state => params => {
    return (
      state.chains[(params as API.VerifyTraceReq).chain_name].verifiedTraces[(params as API.VerifyTraceReq).hash] ??
      ({} as API.VerifyTrace)
    );
  },
  getFeeAddress: state => params => {
    return state.chains[(params as API.ChainReq).chain_name].fee_address ?? ({} as API.FeeAddress);
  },
  getBech32Config: state => params => {
    return state.chains[(params as API.ChainReq).chain_name].node_info.bech32_config ?? ({} as API.Bech32Config);
  },
  getFee: state => params => {
    return state.chains[(params as API.ChainReq).chain_name].base_fee ?? ({} as API.Fee);
  },
  getBaseFee: state => params => {
    return state.chains[(params as API.ChainReq).chain_name].base_fee ?? ({} as API.Fee);
  },
  getIBCFee: state => params => {
    return state.chains[(params as API.ChainReq).chain_name].base_ibc_fee ?? ({} as API.Fee);
  },
  getFeeTokens: state => params => {
    return state.chains[(params as API.ChainReq).chain_name].fee_tokens ?? ({} as API.FeeTokens);
  },
  getChain: state => params => {
    return state.chains[(params as API.ChainReq).chain_name] ?? ({} as ChainData);
  },
  getPrimaryChannel: state => params => {
    return (
      state.chains[(params as API.ChainReq).chain_name].primaryChannels[
        (params as API.ChainReq).destination_chain_name
      ] ?? ({} as API.PrimaryChannel)
    );
  },
  getPrimaryChannels: state => params => {
    const channels = [];
    for (const channel of Object.values(state.chains[(params as API.ChainReq).chain_name].primaryChannels)) {
      channels.push(channel);
    }
    return channels;
  },
  getChainStatus: state => params => {
    state.chains[(params as API.ChainReq).chain_name].status ?? false;
  },
};
