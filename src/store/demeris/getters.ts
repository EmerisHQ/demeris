import { GetterTree } from 'vuex';

import { RootState } from '@/store';
import * as API from '@/types/api';
import { parseCoins } from '@/utils/basic';
import { chainAddressfromAddress, keyHashfromAddress } from '@/utils/basic';

import { ChainData, State } from './state';

export type Getters = {
  getBalances(state: State): { (params: API.APIRequests): API.Balances | null };
  getStakingBalances(state: State): { (params: API.APIRequests): API.StakingBalances | null };
  getNumbers(state: State): { (params: API.APIRequests): API.Numbers | null };
  getAllBalances(state: State): API.Balances | null;
  getAllStakingBalances(state: State): API.StakingBalances | null;
  getAllNumbers(state: State): API.Numbers | null;
  getFeeAddresses(state: State): API.FeeAddresses | null;
  getVerifiedDenoms(state: State): API.VerifiedDenoms | null;
  getChains(state: State): Record<string, ChainData>;
  getGasLimit(state: State): number;
  getPrices(state: State): API.Prices;
  getPrice(
    state: State,
    getters,
  ): {
    (params: { denom: string }): number;
  };
  getDisplayDenom(
    state: State,
    getters,
    rootState,
    rootGetters,
  ): {
    (params: { name: string }): string;
  };
  getDisplayChain(state: State): {
    (params: { name: string }): string;
  };
  getDenomPrecision(state: State): {
    (params: { name: string }): string;
  };
  isVerified(state: State): {
    (params: { denom: string; chain_name: string }): boolean;
  };
  getEndpoint(state: State): string;
  isSignedIn(state: State): boolean;
  getDexChain(state: State): string;
  getKeyhashes(state: State): string[];
  getTxStatus(state: State): { (params: API.APIRequests): Promise<void> | null };
  getKeplrAccountName(state: State): string | null;
  getOwnAddress(state: State): { (params: API.APIRequests): string | null };
  getVerifyTrace(state: State): { (params: API.APIRequests): API.VerifyTrace | null };
  getFeeAddress(state: State): { (params: API.APIRequests): API.FeeAddress | null };
  getBech32Config(state: State): { (params: API.APIRequests): API.Bech32Config | null };
  getFeeTokens(state: State): { (params: API.APIRequests): API.FeeTokens | null };
  getChain(state: State): { (params: API.APIRequests): ChainData | null };
  getPrimaryChannel(state: State): { (params: API.APIRequests): string | null };
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
  getAllBalances: (state) => {
    const balances = Object.values(state.balances)
      .filter((balance) => balance !== null)
      .flat()
      .filter((balance) => parseCoins(balance.amount)[0].amount != '0');
    return balances.length > 0 ? balances : null;
  },
  getAllStakingBalances: (state) => {
    const stakingBalances = Object.values(state.stakingBalances).flat();
    return stakingBalances.length > 0 ? stakingBalances : null;
  },
  getNumbers: (state) => (params) => {
    return state.numbers[(params as API.AddrReq).address] ?? null;
  },
  getAllNumbers: (state) => {
    const numbers = Object.values(state.numbers).flat();
    return numbers.length > 0 ? numbers : null;
  },
  getFeeAddresses: (state) => {
    const feeAddresses = [];
    for (const chain of Object.values(state.chains)) {
      feeAddresses.push({ chain_name: chain.chain_name, demeris_address: chain.demeris_addresses[0] });
    }
    return feeAddresses.length != 0 ? feeAddresses : null;
  },
  getVerifiedDenoms: (state) => {
    return state.verifiedDenoms.length != 0 ? state.verifiedDenoms : null;
  },
  getDisplayDenom:
    (state, getters, rootState, rootGetters) =>
    ({ name }) => {
      const displayName = state.verifiedDenoms.find((x) => x.name == name)?.display_name ?? null;
      if (displayName) {
        return displayName;
      }
      const pools = rootGetters['tendermint.liquidity.v1beta1/getLiquidityPools']();
      if (pools && pools.pools) {
        const pool = pools.pools.find((x) => x.pool_coin_denom == name);
        if (pool) {
          return (
            'GDEX ' +
            getters['getDisplayDenom']({ name: pool.reserve_coin_denoms[0] }) +
            '/' +
            getters['getDisplayDenom']({ name: pool.reserve_coin_denoms[1] }) +
            ' Pool'
          );
        } else {
          return null;
        }
      }
    },
  getDisplayChain:
    (state) =>
    ({ name }) => {
      return state.chains[name]?.display_name ?? null;
    },
  getDenomPrecision:
    (state) =>
    ({ name }) => {
      return state.verifiedDenoms.find((x) => x.name == name)?.precision ?? null;
    },
  getChains: (state) => {
    return Object.keys(state.chains).length != 0 ? state.chains : null;
  },
  getPrices: (state) => {
    return state.prices;
  },
  isVerified: (state) => (params) => {
    return state.verifiedDenoms.find((x) => x.name == params.denom)?.verified ?? false;
  },
  getPrice: (state, getters) => (params) => {
    const ticker = (getters['getDisplayDenom']({ name: params.denom }) + 'USDT').toUpperCase();
    return state.prices.find((x) => x.Symbol == ticker)?.Price ?? null;
  },
  getEndpoint: (state) => {
    return state.endpoint;
  },
  isSignedIn: (state) => {
    return state.keplr ? true : false;
  },
  getKeplrAccountName: (state) => {
    return state.keplr?.name ?? null;
  },
  getDexChain: (state) => {
    return state.hub_chain;
  },
  getTxStatus: (state) => (params) => {
    return state.transactions.get(JSON.stringify(params))?.promise ?? null;
  },
  getOwnAddress: (state) => (params) => {
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
  getKeyhashes: (state) => {
    if (state.keplr && state.keplr.keyHashes) {
      return state.keplr.keyHashes;
    } else {
      return null;
    }
  },
  getVerifyTrace: (state) => (params) => {
    if (
      state.chains[(params as API.VerifyTraceReq).chain_name] &&
      state.chains[(params as API.VerifyTraceReq).chain_name].verifiedTraces
    ) {
      return (
        state.chains[(params as API.VerifyTraceReq).chain_name]?.verifiedTraces[(params as API.VerifyTraceReq).hash] ??
        null
      );
    } else {
      return null;
    }
  },
  getFeeAddress: (state) => (params) => {
    return state.chains[(params as API.ChainReq).chain_name]?.demeris_addresses[0] ?? null;
  },
  getBech32Config: (state) => (params) => {
    return state.chains[(params as API.ChainReq).chain_name]?.node_info.bech32_config ?? null;
  },
  getFeeTokens: (state) => (params) => {
    return state.chains[(params as API.ChainReq).chain_name]?.denoms.filter((x) => x.fee_token) ?? null;
  },
  getChain: (state) => (params) => {
    return state.chains[(params as API.ChainReq).chain_name] ?? null;
  },
  getGasLimit: (state) => {
    return state.gas_limit;
  },
  getPrimaryChannel: (state) => (params) => {
    return (
      state.chains[(params as API.ChainReq).chain_name]?.primary_channel[
        (params as API.ChainReq).destination_chain_name
      ] ?? null
    );
  },
  getPrimaryChannels: (state) => (params) => {
    const channels = [];
    for (const channel of Object.values(state.chains[(params as API.ChainReq).chain_name].primary_channel)) {
      channels.push(channel);
    }
    return channels.length != 0 ? channels : null;
  },
  getChainStatus: (state) => (params) => {
    return state.chains[(params as API.ChainReq).chain_name]?.status ?? false;
  },
};
