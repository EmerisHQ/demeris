import BigNumber from 'bignumber.js';
import { GetterTree } from 'vuex';

import { RootState } from '@/store';
import { GasPriceLevel, Pool } from '@/types/actions';
import * as API from '@/types/api';
import { parseCoins } from '@/utils/basic';
import { chainAddressfromAddress, keyHashfromAddress } from '@/utils/basic';

import { ChainData, State } from './state';

export type Getters = {
  getBalances(state: State): { (params: API.APIRequests): API.Balances | null };
  getStakingBalances(state: State): { (params: API.APIRequests): API.StakingBalances | null };
  getNumbers(state: State): { (params: API.APIRequests): API.Numbers | null };
  getAllBalances(state: State, getters, rootState): API.Balances | null;
  getAllStakingBalances(state: State): API.StakingBalances | null;
  getAllNumbers(state: State): API.Numbers | null;
  getFeeAddresses(state: State): API.FeeAddresses | null;
  getVerifiedDenoms(state: State): API.VerifiedDenoms | null;
  getChains(state: State): Record<string, ChainData>;
  getPrices(state: State): API.Prices;
  getPrice(
    state: State,
    getters,
  ): {
    (params: { denom: string }): number;
  };
  getTicker(
    state: State,
    getters,
  ): {
    (params: { name: string }): string;
  };
  getDisplayChain(state: State): {
    (params: { name: string }): string;
  };
  getDenomPrecision(state: State): {
    (params: { name: string }): string;
  };
  getEndpoint(state: State): string;
  getAllValidPools(state: State): Pool[];
  getDexChain(state: State): string;
  getTxStatus(state: State): { (params: API.APIRequests): Promise<string> | null };
  getOwnAddress(state: State, getters, rootState): { (params: API.APIRequests): string | null };
  getVerifyTrace(state: State): { (params: API.APIRequests): API.VerifyTrace | null };
  getFeeAddress(state: State): { (params: API.APIRequests): API.FeeAddress | null };
  getBech32Config(state: State): { (params: API.APIRequests): API.Bech32Config | null };
  getFeeTokens(state: State): { (params: API.APIRequests): API.FeeTokens | null };
  getChain(state: State): { (params: API.APIRequests): ChainData | null };
  getPrimaryChannel(state: State): { (params: API.APIRequests): string | null };
  getPrimaryChannels(state: State): { (params: API.APIRequests): API.PrimaryChannels | null };
  getChainStatus(state: State): { (params: API.APIRequests): boolean };
};

function getKeplr(rootState) {
  // FIXME: this is hacky, should use namespace constant
  return rootState.demerisUSER.keplr;
}

export const getters: GetterTree<State, RootState> & Getters = {
  getBalances: (state) => (params) => {
    return state.balances[(params as API.AddrReq).address] ?? null;
  },
  getStakingBalances: (state) => (params) => {
    return state.stakingBalances[(params as API.AddrReq).address] ?? null;
  },
  getAllBalances: (state: State, getters, rootState) => {
    if (!getKeplr(rootState)) {
      return null;
    }

    const balances = Object.values(state.balances)
      .filter((balance) => balance !== null)
      .flat()
      .filter((balance) => getKeplr(rootState).keyHashes.indexOf(balance.address) > -1)
      .filter((balance) => parseCoins(balance.amount)[0].amount != '0');
    return balances.length > 0 ? balances : null;
  },
  getAllValidPools: (state) => {
    return state.validPools ?? [];
  },
  getAllStakingBalances: (state) => {
    const stakingBalances = Object.values(state.stakingBalances)
      .filter((balance) => balance !== null)
      .flat();
    return stakingBalances.length > 0 ? stakingBalances : null;
  },
  getNumbers: (state) => (params) => {
    return state.numbers[(params as API.AddrReq).address] ?? null;
  },
  getNumbersChain: (state) => (params) => {
    return state.chainnumbers[(params as API.ChainAddrReq).chain_name][(params as API.ChainAddrReq).address] ?? null;
  },
  getRelayerStatus: (state) => {
    return state.relayer;
  },
  getRelayerBalance: (state) => (params) => {
    return state.chains[(params as API.ChainReq).chain_name].relayerBalance;
  },
  getRelayerChainStatus: (state) => (params) => {
    return true || (state.chains[(params as API.ChainReq).chain_name].relayerBalance.enough_balance && state.relayer);
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
  getTicker:
    (state, getters) =>
    ({ name }) => {
      const ticker = state.verifiedDenoms.find((x) => x.name == name)?.ticker ?? null;
      if (ticker) {
        return ticker;
      }
      const pools = getters['tendermint.liquidity.v1beta1/getAllValidPools'];
      if (pools && pools.pools) {
        const pool = pools.pools.find((x) => x.pool_coin_denom == name);
        if (pool) {
          return 'G' + (pools.length + 1);
        } else {
          return null;
        }
      }
    },
  getChainFromChainId: (state) => (chain_id) => {
    return Object.values(state.chains).find((x) => x.node_info.chain_id == chain_id).chain_name;
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
  getExchangeAmountFromATOMPool: (state, getters) => (base_denom: string) => {
    const traces = getters['getAllVerifiedTraces'];
    const pools = getters['getAllValidPools'];

    let referencePool = null;
    let reserveBaseDenoms = [];

    for (const pool of pools) {
      reserveBaseDenoms = [];

      for (const coinDenom of pool.reserve_coin_denoms) {
        reserveBaseDenoms.push(traces[coinDenom.split('/')[1]]?.base_denom ?? coinDenom);
      }

      if (reserveBaseDenoms.includes('uatom') && reserveBaseDenoms.includes(base_denom)) {
        referencePool = pool;
        break;
      }
    }

    if (!referencePool) {
      return;
    }

    const reserveBalances = getters['getBalances']({
      address: keyHashfromAddress(referencePool.reserve_account_address),
    });

    if (!reserveBalances) {
      return;
    }

    const amounts = reserveBaseDenoms.sort().reduce((acc, baseDenom) => {
      const balance = reserveBalances.find((item) => item.base_denom === baseDenom);
      return [
        ...acc,
        {
          ...parseCoins(balance.amount)[0],
          base_denom: baseDenom,
          precision: getters['getDenomPrecision']({ name: baseDenom }) ?? 6,
        },
      ];
    }, []);

    const targetIndex = amounts.findIndex((item) => item.base_denom === base_denom);
    const counterpartIndex = targetIndex === 0 ? 1 : 0;

    const exchangeAmount = new BigNumber(amounts[counterpartIndex].amount)
      .dividedBy(amounts[targetIndex].amount)
      .toNumber();

    return exchangeAmount;
  },
  getPrice: (state, getters) => (params) => {
    const ticker = (getters['getTicker']({ name: params.denom }) + 'USDT').toUpperCase();
    const marketPrice = state.prices.Tokens.find((x) => x.Symbol == ticker)?.Price ?? null;

    if (marketPrice) {
      return marketPrice;
    }

    const exchangeAmountFromPool = getters['getExchangeAmountFromATOMPool'](params.denom);

    if (exchangeAmountFromPool) {
      const exchangedDenomPrecision = getters['getDenomPrecision']({
        name: params.denom,
      });
      const ATOMPrice = getters['getPrice']({ denom: 'uatom' });

      return exchangeAmountFromPool * ATOMPrice * 10 ** (exchangedDenomPrecision - 6);
    }

    return null;
  },
  getSupply: (state, getters) => (params) => {
    const ticker = (getters['getTicker']({ name: params.denom }) + 'USDT').toUpperCase();
    return state.prices.Tokens.find((x) => x.Symbol == ticker)?.Supply ?? null;
  },
  getEndpoint: (state) => {
    return state.endpoint;
  },
  getDexChain: (state) => {
    return state.hub_chain;
  },
  getTxStatus: (state) => (params) => {
    return state.transactions.get(JSON.stringify(params))?.promise ?? null;
  },
  getOwnAddress: (state: State, getters, rootState) => (params) => {
    return (
      chainAddressfromAddress(
        state.chains[(params as API.ChainReq).chain_name].node_info.bech32_config.main_prefix,
        getKeplr(rootState).bech32Address,
      ) ?? null
    );
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
  getAllVerifiedTraces: (state) => {
    let result = {};
    for (const chain of Object.values(state.chains)) {
      result = {
        ...result,
        ...chain.verifiedTraces,
      };
    }
    return result;
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
