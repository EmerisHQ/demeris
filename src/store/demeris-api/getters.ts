/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/naming-convention */
import { EmerisAirdrops, EmerisAPI, EmerisBase } from '@emeris/types';
import BigNumber from 'bignumber.js';
import { GetterTree } from 'vuex';

import { RootState } from '@/store';
import { Pool } from '@/types/actions';
import { ChartPrices, LoadingState, Namespaced } from '@/types/util';
import { keyHashfromAddress, parseCoins } from '@/utils/basic';

import { GlobalGetterTypes as GlobalUserGetterTypes } from '../demeris-user';
import { GetterTypes } from './getter-types';
import { APIState } from './state';

export type Getters = {
  [GetterTypes.getBalances](state: APIState): { (params: EmerisAPI.AddrReq): EmerisAPI.Balances | null };
  [GetterTypes.getStakingBalances](state: APIState): { (params: EmerisAPI.AddrReq): EmerisAPI.StakingBalances | null };
  [GetterTypes.getUnstakingParam](state: APIState): { (params: EmerisAPI.ChainReq): EmerisAPI.StakingParams };
  [GetterTypes.getUnbondingDelegations](state: APIState): {
    (params: EmerisAPI.AddrReq): EmerisAPI.UnbondingDelegations | null;
  };
  [GetterTypes.getNumbersChain](state: APIState): { (params: EmerisAPI.ChainAddrReq): EmerisAPI.SeqNumber | null };
  [GetterTypes.getChainAPR](state: APIState): { (params: EmerisAPI.ChainReq): string };
  [GetterTypes.getRelayerChainStatus](state: APIState): { (params: EmerisAPI.ChainReq): boolean };
  [GetterTypes.getAllBalances](state: APIState, getters, rootState, rootGetters): EmerisAPI.Balances | null;
  [GetterTypes.getAllStakingBalances](state: APIState): EmerisAPI.StakingBalances | null;
  [GetterTypes.getAllUnbondingDelegations](state: APIState): EmerisAPI.UnbondingDelegations | null;
  [GetterTypes.getVerifiedDenoms](state: APIState): EmerisAPI.VerifiedDenoms | null;
  [GetterTypes.getChains](state: APIState): Record<string, EmerisAPI.Chain>;
  [GetterTypes.getPrices](state: APIState): EmerisAPI.Prices;
  [GetterTypes.getExchangeAmountFromATOMPool](state: APIState, getters): { (base_denom: string): number };
  [GetterTypes.getPrice](
    state: APIState,
    getters,
  ): {
    (params: { denom: string }): number;
  };
  [GetterTypes.getTicker](
    state: APIState,
    getters,
  ): {
    (params: { name: string }): string;
  };
  [GetterTypes.getChainFromChainId](state: APIState): {
    (chain_id: string): string;
  };
  [GetterTypes.getDisplayChain](state: APIState): {
    (params: { name: string }): string;
  };
  [GetterTypes.getDenomPrecision](state: APIState): {
    (params: { name: string }): number;
  };
  [GetterTypes.getWebSocketEndpoint](state: APIState): string;
  [GetterTypes.getAllValidPools](state: APIState): Pool[];
  [GetterTypes.getEndpoint](state: APIState): string;
  [GetterTypes.getGitEndpoint](state: APIState): string;
  [GetterTypes.getRawGitEndpoint](state: APIState): string;
  [GetterTypes.getSupply](state: APIState, getters): { (params): number };
  [GetterTypes.getAllVerifiedTraces](state: APIState): Record<string, EmerisAPI.VerifyTrace>;
  [GetterTypes.getBech32Config](state: APIState): { (params: EmerisAPI.ChainReq): EmerisBase.Bech32Config | null };
  [GetterTypes.getDexChain](state: APIState): string;
  [GetterTypes.getTxStatus](state: APIState): {
    (params: EmerisAPI.TicketReq): Promise<EmerisAPI.TicketResponse> | null;
  };
  [GetterTypes.isVerified](state: APIState): {
    (params: { denom: string; chain_name: string }): boolean;
  };
  [GetterTypes.getVerifyTrace](state: APIState): { (params: EmerisAPI.VerifyTraceReq): EmerisAPI.VerifyTrace | null };
  [GetterTypes.getFeeTokens](state: APIState): { (params: EmerisAPI.ChainReq): EmerisBase.Denom[] | null };
  [GetterTypes.getChain](state: APIState): { (params: EmerisAPI.ChainReq): EmerisAPI.Chain | null };
  [GetterTypes.getPrimaryChannel](state: APIState): { (params: EmerisAPI.ChainCounterPartyReq): string | null };
  [GetterTypes.getTokenPrices](state: APIState): ChartPrices | null;
  [GetterTypes.getAirdrops](state: APIState): EmerisAirdrops.Airdrop[] | null;
  [GetterTypes.getAirdropsStatus](state: APIState): LoadingState | null;
  [GetterTypes.getSelectedAirdrop](state: APIState): EmerisAirdrops.Airdrop | null;
  [GetterTypes.getChainStatus](state: APIState): { (params: EmerisAPI.ChainReq): boolean };
  [GetterTypes.getChainNameByBaseDenom](state: APIState): { (params: EmerisAPI.DenomReq): string };

  // Coingecko Getters
  [GetterTypes.getCoinGeckoId](state: APIState): string | null;
};

export type GlobalGetters = Namespaced<Getters, 'demerisAPI'>;

export const getters: GetterTree<APIState, RootState> & Getters = {
  [GetterTypes.getBalances]: (state) => (params) => {
    return state.balances[params.address] ?? null;
  },
  [GetterTypes.getStakingBalances]: (state) => (params) => {
    return state.stakingBalances[params.address] ?? null;
  },
  [GetterTypes.getUnstakingParam]: (state) => (params) => {
    return state.unstakingParams[params.chain_name] ?? null;
  },
  [GetterTypes.getUnbondingDelegations]: (state) => (params) => {
    return state.unbondingDelegations[params.address] ?? null;
  },

  [GetterTypes.getRelayerChainStatus]: (_state) => (_params) => {
    return true;
  },
  [GetterTypes.getAllBalances]: (state: APIState, _getters, _rootState, rootGetters) => {
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
  [GetterTypes.getNumbersChain]: (state) => (params) => {
    return state.chainnumbers[params.chain_name][params.address] ?? null;
  },
  [GetterTypes.getChainAPR]: (state) => (params) => {
    return state.chains[params.chain_name].apr;
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
  [GetterTypes.getGitEndpoint]: (state) => {
    return state.gitEndpoint;
  },
  [GetterTypes.getRawGitEndpoint]: (state) => {
    return state.rawGitEndpoint;
  },
  [GetterTypes.getWebSocketEndpoint]: (state) => {
    return state.wsEndpoint;
  },
  [GetterTypes.getDexChain]: (state) => {
    return state.hub_chain;
  },
  [GetterTypes.getTxStatus]: (state) => (params) => {
    return state.transactions.get(JSON.stringify(params))?.promise ?? null;
  },
  [GetterTypes.getVerifyTrace]: (state) => (params) => {
    if (state.traces[params.chain_name]) {
      return state.traces[params.chain_name][params.hash] ?? null;
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
  [GetterTypes.getBech32Config]: (state) => (params) => {
    return state.chains[params.chain_name]?.node_info.bech32_config ?? null;
  },
  [GetterTypes.getFeeTokens]: (state) => (params) => {
    return state.chains[params.chain_name]?.denoms?.filter((x) => x.fee_token) ?? [];
  },
  [GetterTypes.getChain]: (state) => (params) => {
    return state.chains[params.chain_name] ?? null;
  },
  [GetterTypes.getPrimaryChannel]: (state) => (params) => {
    return state.chains?.[params.chain_name]?.primary_channel[params.destination_chain_name] ?? null;
  },
  [GetterTypes.getPrimaryChannels]: (state) => (params) => {
    const channels = [];
    for (const channel of Object.values(state.chains[params.chain_name].primary_channel)) {
      channels.push(channel);
    }
    return channels.length != 0 ? channels : null;
  },
  [GetterTypes.getTokenPrices]: (state) => {
    return state.tokenPrices;
  },
  [GetterTypes.getAirdrops]: (state) => {
    return state.airdrops;
  },
  [GetterTypes.getAirdropsStatus]: (state) => {
    return state.airdropsStatus;
  },
  [GetterTypes.getSelectedAirdrop]: (state) => {
    return state.selectedAirdrop;
  },
  [GetterTypes.getTokenPricesLoadingStatus]: (state) => {
    return state.tokenPricesLoadingStatus;
  },
  [GetterTypes.getChainStatus]: (state) => (params) => {
    return state.chains[params.chain_name]?.online;
  },
  [GetterTypes.getChainNameByBaseDenom]: (state) => (params) => {
    return Object.values(state.chains)?.find((chain) => {
      return chain.denoms?.find((denom) => denom.name === params.denom);
    })?.chain_name;
  },

  // Coingecko Getters
  [GetterTypes.getCoinGeckoId]: (state) => {
    return state.coinGeckoId;
  },
  [GetterTypes.getCoinGeckoIdLoadingStatus]: (state) => {
    return state.coinGeckoIdLoadingStatus;
  },
};
