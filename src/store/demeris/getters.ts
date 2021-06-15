import { GetterTree } from 'vuex';

import { RootState } from '@/store';
import * as API from '@/types/api';
import { chainAddressfromAddress, keyHashfromAddress } from '@/utils/basic';

import { ChainData, State } from './state';

export type Getters = {
  getBalances(state: State): { (params: API.APIRequests): API.Balances | null };
  getStakingBalances(state: State): { (params: API.APIRequests): API.StakingBalances | null };
  getNumbers(state: State): { (params: API.APIRequests): API.Numbers | null };
  getFeeAddresses(state: State): API.FeeAddresses | null;
  getVerifiedDenoms(state: State): API.VerifiedDenoms | null;
  getChains(state: State): Record<string, ChainData>;
  getPrices(state: State): any; //TODO prices
  getEndpoint(state: State): string;
  isSignedIn(state: State): boolean;
  getDexChain(state: State): string;
  getKeplrAccountName(state: State): string | null;
  getOwnAddress(state: State): { (params: API.APIRequests): string | null };
  getVerifyTrace(state: State): { (params: API.APIRequests): API.VerifyTrace | null };
  getFeeAddress(state: State): { (params: API.APIRequests): API.FeeAddress | null };
  getBech32Config(state: State): { (params: API.APIRequests): API.Bech32Config | null };
  getFee(state: State): { (params: API.APIRequests): API.Fee | null };
  getBaseFee(state: State): { (params: API.APIRequests): API.Fee | null };
  getIBCFee(state: State): { (params: API.APIRequests): API.Fee | null };
  getFeeTokens(state: State): { (params: API.APIRequests): API.FeeTokens | null };
  getChain(state: State): { (params: API.APIRequests): ChainData | null };
  getPrimaryChannel(state: State): { (params: API.APIRequests): API.PrimaryChannel | null };
  getPrimaryChannels(state: State): { (params: API.APIRequests): API.PrimaryChannels | null };
  getChainStatus(state: State): { (params: API.APIRequests): boolean };
};

export const getters: GetterTree<State, RootState> & Getters = {
  getBalances: (state) => (params) => {
    return state.balances[(params as API.AddrReq).address] ?? null;
  },
  getStakingBalances: (state) => (params) => {
    return state.stakingBalances[(params as API.AddrReq).address] ?? null;
  },
  getNumbers: (state) => (params) => {
    return state.numbers[(params as API.AddrReq).address] ?? null;
  },
  getFeeAddresses: (state) => {
    const feeAddresses = [];
    for (const chain of Object.values(state.chains)) {
      feeAddresses.push({ chain_name: chain.base_fee, fee_address: chain.fee_address });
    }
    return feeAddresses.length != 0 ? feeAddresses : null;
  },
  getVerifiedDenoms: (state) => {
    return state.verifiedDenoms.length != 0 ? state.verifiedDenoms : null;
  },
  getDisplayDenom:
    (state) =>
    ({ name, chain_name }) => {
      return state.verifiedDenoms.find((x) => x.name == name && x.chain_name == chain_name)?.display_name ?? null;
    },
  getChains: (state) => {
    return Object.keys(state.chains).length != 0 ? state.chains : null;
  },
  getPrices: (state) => {
    return state.prices; //TODO: Prices
  },
  getEndpoint: (state) => {
    return state.endpoint; //TODO: Prices
  },
  isSignedIn: (state) => {
    return state.keplr ? true : false;
  },
  getKeplrAccountName: (state) => {
    return state.keplr?.name ?? null;
  },
  getDexChain: (state) => {
    return 'cosmos-hub'; //TODO
  },
  getOwnAddress: (state) => (params) => {
    console.log(state);
    return (
      chainAddressfromAddress(
        state.chains[(params as API.ChainReq).chain_name].node_info.bech32_config.main_prefix,
        state.keplr.bech32Address,
      ) ?? null
    );
  },
  getKeplrAddress: (state) => {
    if (state.keplr) {
      return keyHashfromAddress(state.keplr.bech32Address);
    } else {
      return null;
    }
  },
  getVerifyTrace: (state) => (params) => {
    return (
      state.chains[(params as API.VerifyTraceReq).chain_name]?.verifiedTraces[(params as API.VerifyTraceReq).hash] ??
      null
    );
  },
  getFeeAddress: (state) => (params) => {
    return state.chains[(params as API.ChainReq).chain_name]?.fee_address ?? null;
  },
  getBech32Config: (state) => (params) => {
    return state.chains[(params as API.ChainReq).chain_name]?.node_info.bech32_config ?? null;
  },
  getFee: (state) => (params) => {
    return state.chains[(params as API.ChainReq).chain_name]?.base_fee ?? null;
  },
  getBaseFee: (state) => (params) => {
    return state.chains[(params as API.ChainReq).chain_name]?.base_fee ?? null;
  },
  getIBCFee: (state) => (params) => {
    return state.chains[(params as API.ChainReq).chain_name]?.base_ibc_fee ?? null;
  },
  getFeeTokens: (state) => (params) => {
    return state.chains[(params as API.ChainReq).chain_name]?.fee_tokens ?? null;
  },
  getChain: (state) => (params) => {
    return state.chains[(params as API.ChainReq).chain_name] ?? null;
  },
  getPrimaryChannel: (state) => (params) => {
    return (
      state.chains[(params as API.ChainReq).chain_name]?.primaryChannels[
        (params as API.ChainReq).destination_chain_name
      ] ?? null
    );
  },
  getPrimaryChannels: (state) => (params) => {
    const channels = [];
    for (const channel of Object.values(state.chains[(params as API.ChainReq).chain_name].primaryChannels)) {
      channels.push(channel);
    }
    return channels.length != 0 ? channels : null;
  },
  getChainStatus: (state) => (params) => {
    return state.chains[(params as API.ChainReq).chain_name]?.status ?? false;
  },
};
