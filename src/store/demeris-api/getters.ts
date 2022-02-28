import BigNumber from 'bignumber.js';
import { GetterTree } from 'vuex';

import { RootState } from '@/store';
import { Pool } from '@/types/actions';
import * as API from '@/types/api';
import { parseCoins } from '@/utils/basic';
import { chainAddressfromAddress, keyHashfromAddress } from '@/utils/basic';
import { featureRunning } from '@/utils/FeatureManager';

import { GlobalGetterTypes as GlobalUserGetterTypes } from '../demeris-user';
import { GetterTypes } from './getter-types';
import { ChainData, State } from './state';
type Namespaced<T, N extends string> = {
  [P in keyof T & string as `${N}/${P}`]: T[P];
};
export type Getters = {
  [GetterTypes.getBalances](state: State): { (params: API.APIRequests): API.Balances | null };
  [GetterTypes.getStakingBalances](state: State): { (params: API.APIRequests): API.StakingBalances | null };
  [GetterTypes.getUnbondingDelegations](state: State): { (params: API.APIRequests): API.UnbondingDelegations | null };
  [GetterTypes.getNumbers](state: State): { (params: API.APIRequests): API.Numbers | null };
  [GetterTypes.getNumbersChain](state: State): { (params: API.APIRequests): API.SeqNumber | null };
  [GetterTypes.getRelayerStatus](state: State): boolean;
  [GetterTypes.getRelayerBalance](state: State): { (params: API.APIRequests): API.RelayerBalance };
  [GetterTypes.getRelayerChainStatus](state: State): { (params: API.APIRequests): boolean };
  [GetterTypes.getAllBalances](state: State, getters, rootState, rootGetters): API.Balances | null;
  [GetterTypes.getAllStakingBalances](state: State): API.StakingBalances | null;
  [GetterTypes.getAllUnbondingDelegations](state: State): API.UnbondingDelegations | null;
  [GetterTypes.getAllNumbers](state: State): API.Numbers | null;
  [GetterTypes.getFeeAddresses](state: State): API.FeeAddresses | null;
  [GetterTypes.getVerifiedDenoms](state: State): API.VerifiedDenoms | null;
  [GetterTypes.getChains](state: State): Record<string, ChainData>;
  [GetterTypes.getPrices](state: State): API.Prices;
  [GetterTypes.getExchangeAmountFromATOMPool](state: State, getters): { (base_denom: string): number };
  [GetterTypes.getPrice](
    state: State,
    getters,
  ): {
    (params: { denom: string }): number;
  };
  [GetterTypes.getTicker](
    state: State,
    getters,
  ): {
    (params: { name: string }): string;
  };
  [GetterTypes.getChainFromChainId](state: State): {
    (chain_id: string): string;
  };
  [GetterTypes.getDisplayChain](state: State): {
    (params: { name: string }): string;
  };
  [GetterTypes.getDenomPrecision](state: State): {
    (params: { name: string }): string;
  };
  [GetterTypes.getEndpoint](state: State): string;
  [GetterTypes.getAllValidPools](state: State): Pool[];
  [GetterTypes.getSupply](state: State, getters): { (params): number };
  [GetterTypes.getAllVerifiedTraces](state: State): Record<string, API.VerifyTrace>;
  [GetterTypes.getDexChain](state: State): string;
  [GetterTypes.getTxStatus](state: State): { (params: API.APIRequests): Promise<API.Ticket> | null };
  [GetterTypes.isVerified](state: State): {
    (params: { denom: string; chain_name: string }): boolean;
  };
  [GetterTypes.getOwnAddress](
    state: State,
    getters,
    rootState,
    rootGetters,
  ): { (params: API.APIRequests): string | null };
  [GetterTypes.getVerifyTrace](state: State): { (params: API.APIRequests): API.VerifyTrace | null };
  [GetterTypes.getFeeAddress](state: State): { (params: API.APIRequests): API.FeeAddress | null };
  [GetterTypes.getBech32Config](state: State): { (params: API.APIRequests): API.Bech32Config | null };
  [GetterTypes.getFeeTokens](state: State): { (params: API.APIRequests): API.FeeTokens | null };
  [GetterTypes.getChain](state: State): { (params: API.APIRequests): ChainData | null };
  [GetterTypes.getPrimaryChannel](state: State): { (params: API.APIRequests): string | null };
  [GetterTypes.getPrimaryChannels](state: State): { (params: API.APIRequests): API.PrimaryChannels | null };
  [GetterTypes.getTokenPrices](state: State): API.TokenPrices[] | null;
  [GetterTypes.getTokenId](state: State): string | null;
  [GetterTypes.getChainStatus](state: State): { (params: API.APIRequests): boolean };
  [GetterTypes.getChainNameByBaseDenom](state: State): { (params: API.APIRequests): string };
};

export type GlobalGetters = Namespaced<Getters, 'demerisAPI'>;

export const getters: GetterTree<State, RootState> & Getters = {
  [GetterTypes.getBalances]: (state) => (params) => {
    return state.balances[(params as API.AddrReq).address] ?? null;
  },
  [GetterTypes.getStakingBalances]: (state) => (params) => {
    return state.stakingBalances[(params as API.AddrReq).address] ?? null;
  },
  [GetterTypes.getUnbondingDelegations]: (state) => (params) => {
    return state.unbondingDelegations[(params as API.AddrReq).address] ?? null;
  },
  [GetterTypes.getAllBalances]: (state: State, _getters, _rootState, rootGetters) => {
    if (!rootGetters[GlobalUserGetterTypes.getKeplr]) {
      return null;
    }

    const balances = Object.values(state.balances)
      .filter((balance) => balance !== null)
      .flat()
      .filter((balance) => rootGetters[GlobalUserGetterTypes.getKeplr].keyHashes.indexOf(balance.address) > -1)
      .filter((balance) => parseCoins(balance.amount)[0].amount != '0');
    return balances.length > 0 ? balances : null;
  },
  [GetterTypes.getAllValidPools]: (state) => {
    return state.validPools;
  },
  [GetterTypes.getAllStakingBalances]: (state) => {
    const stakingBalances = Object.values(state.stakingBalances)
      .filter((balance) => balance !== null)
      .flat();
    return stakingBalances.length > 0 ? stakingBalances : null;
  },
  [GetterTypes.getAllUnbondingDelegations]: (state) => {
    const unbondingDelegations = Object.values(state.unbondingDelegations)
      .filter((balance) => balance !== null)
      .flat();
    return unbondingDelegations.length > 0 ? unbondingDelegations : null;
  },
  [GetterTypes.getNumbers]: (state) => (params) => {
    return state.numbers[(params as API.AddrReq).address] ?? null;
  },
  [GetterTypes.getNumbersChain]: (state) => (params) => {
    return state.chainnumbers[(params as API.ChainAddrReq).chain_name][(params as API.ChainAddrReq).address] ?? null;
  },
  [GetterTypes.getRelayerStatus]: (state) => {
    return state.relayer;
  },
  [GetterTypes.getRelayerBalance]: (state) => (params) => {
    return state.chains[(params as API.ChainReq).chain_name].relayerBalance;
  },
  [GetterTypes.getRelayerChainStatus]: (state) => (params) => {
    return true || (state.chains[(params as API.ChainReq).chain_name].relayerBalance.enough_balance && state.relayer);
  },
  [GetterTypes.getAllNumbers]: (state) => {
    const numbers = Object.values(state.numbers).flat();
    return numbers.length > 0 ? numbers : null;
  },
  [GetterTypes.getFeeAddresses]: (state) => {
    const feeAddresses = [];
    for (const chain of Object.values(state.chains)) {
      feeAddresses.push({ chain_name: chain.chain_name, demeris_address: chain.demeris_addresses[0] });
    }
    return feeAddresses.length != 0 ? feeAddresses : null;
  },
  [GetterTypes.isVerified]: (state) => (params) => {
    return state.verifiedDenoms.find((x) => x.name == params.denom)?.verified ?? false;
  },
  [GetterTypes.getVerifiedDenoms]: (state) => {
    return state.verifiedDenoms.length != 0 ? state.verifiedDenoms : null;
  },
  [GetterTypes.getTicker]:
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
  [GetterTypes.getChainFromChainId]: (state) => (chain_id) => {
    return Object.values(state.chains).find((x) => x.node_info.chain_id == chain_id).chain_name;
  },
  [GetterTypes.getDisplayChain]:
    (state) =>
    ({ name }) => {
      return state.chains[name]?.display_name ?? null;
    },
  [GetterTypes.getDenomPrecision]:
    (state) =>
    ({ name }) => {
      return state.verifiedDenoms.find((x) => x.name == name)?.precision ?? null;
    },
  [GetterTypes.getChains]: (state) => {
    return Object.keys(state.chains).length != 0 ? state.chains : null;
  },
  [GetterTypes.getPrices]: (state) => {
    return state.prices;
  },
  [GetterTypes.getExchangeAmountFromATOMPool]: (state, getters) => (base_denom: string) => {
    const traces = getters['getAllVerifiedTraces'];
    const pools = getters['getAllValidPools'];

    let referencePool = null;
    let reserveBaseDenoms = [];
    if (pools) {
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
  [GetterTypes.getPrice]: (state, getters) => (params) => {
    const ticker = (getters['getTicker']({ name: params.denom }) + 'USDT').toUpperCase();
    if (state.prices.Tokens.length == 0) {
      return;
    }
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
  [GetterTypes.getSupply]: (state, getters) => (params) => {
    const ticker = (getters['getTicker']({ name: params.denom }) + 'USDT').toUpperCase();
    return state.prices.Tokens.find((x) => x.Symbol == ticker)?.Supply ?? null;
  },
  [GetterTypes.getEndpoint]: (state) => {
    return state.endpoint;
  },
  [GetterTypes.getDexChain]: (state) => {
    return state.hub_chain;
  },
  [GetterTypes.getTxStatus]: (state) => (params) => {
    return state.transactions.get(JSON.stringify(params))?.promise ?? null;
  },
  [GetterTypes.getOwnAddress]: (state: State, _getters, _rootState, rootGetters) => (params) => {
    return (
      chainAddressfromAddress(
        state.chains[(params as API.ChainReq).chain_name].node_info.bech32_config.main_prefix,
        rootGetters[GlobalUserGetterTypes.getKeplr].bech32Address,
      ) ?? null
    );
  },
  [GetterTypes.getVerifyTrace]: (state) => (params) => {
    if (state.traces[(params as API.VerifyTraceReq).chain_name]) {
      return state.traces[(params as API.VerifyTraceReq).chain_name][(params as API.VerifyTraceReq).hash] ?? null;
    } else {
      return null;
    }
  },
  [GetterTypes.getAllVerifiedTraces]: (state) => {
    let result = {};
    for (const traces of Object.values(state.traces)) {
      result = {
        ...result,
        ...traces,
      };
    }
    return result;
  },
  [GetterTypes.getFeeAddress]: (state) => (params) => {
    return state.chains[(params as API.ChainReq).chain_name]?.demeris_addresses[0] ?? null;
  },
  [GetterTypes.getBech32Config]: (state) => (params) => {
    return state.chains[(params as API.ChainReq).chain_name]?.node_info.bech32_config ?? null;
  },
  [GetterTypes.getFeeTokens]: (state) => (params) => {
    if (featureRunning('REQUEST_PARALLELIZATION')) {
      return state.chains[(params as API.ChainReq).chain_name]?.denoms?.filter((x) => x.fee_token) ?? [];
    } else {
      return state.chains[(params as API.ChainReq).chain_name]?.denoms?.filter((x) => x.fee_token) ?? null;
    }
  },
  [GetterTypes.getChain]: (state) => (params) => {
    return state.chains[(params as API.ChainReq).chain_name] ?? null;
  },
  [GetterTypes.getPrimaryChannel]: (state) => (params) => {
    return (
      state.chains[(params as API.ChainReq).chain_name]?.primary_channel[
        (params as API.ChainReq).destination_chain_name
      ] ?? null
    );
  },
  [GetterTypes.getPrimaryChannels]: (state) => (params) => {
    const channels = [];
    for (const channel of Object.values(state.chains[(params as API.ChainReq).chain_name].primary_channel)) {
      channels.push(channel);
    }
    return channels.length != 0 ? channels : null;
  },
  [GetterTypes.getTokenPrices]: (state) => {
    return state.tokenPrices;
  },
  [GetterTypes.getTokenId]: (state) => {
    return state.tokenId;
  },
  [GetterTypes.getTokenPricesLoadingStatus]: (state) => {
    return state.tokenPricesLoadingStatus;
  },
  [GetterTypes.getTokenIdLoadingStatus]: (state) => {
    return state.tokenIdLoadingStatus;
  },
  [GetterTypes.getChainStatus]: (state) => (params) => {
    if (featureRunning('REQUEST_PARALLELIZATION')) {
      return state.chains[(params as API.ChainReq).chain_name]?.status;
    } else {
      return state.chains[(params as API.ChainReq).chain_name]?.status ?? false;
    }
  },
  [GetterTypes.getChainNameByBaseDenom]: (state) => (params) => {
    return Object.values(state.chains)?.find((chain) => {
      return chain.denoms?.find((denom) => denom.name === (params as API.DenomReq).denom);
    })?.chain_name;
  },
};
