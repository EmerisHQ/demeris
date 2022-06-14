/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/naming-convention */
import { EmerisAirdrops, EmerisAPI, EmerisBase } from '@emeris/types';
import BigNumber from 'bignumber.js';
import { GetterTree } from 'vuex';

import { RootState } from '@/store';
import { GlobalGetterTypes } from '@/store';
import { Pool } from '@/types/actions';
import { ChartPrices, LoadingState } from '@/types/util';
import { keyHashfromAddress, parseCoins } from '@/utils/basic';
import { featureRunning } from '@/utils/FeatureManager';

import { GlobalGetterTypes as GlobalUserGetterTypes } from '../demeris-user';
import { GetterTypes } from './getter-types';
import { APIState } from './state';

export const getters: GetterTree<APIState, RootState> = {
  [GetterTypes.getBalances]:
    (state: APIState) =>
    (params: EmerisAPI.AddrReq): EmerisAPI.Balances | null => {
      return state.balances[params.address] ?? null;
    },
  [GetterTypes.getStakingBalances]:
    (state: APIState) =>
    (params: EmerisAPI.AddrReq): EmerisAPI.StakingBalances | null => {
      return state.stakingBalances[params.address] ?? null;
    },
  [GetterTypes.getUnstakingParam]:
    (state: APIState) =>
    (params: EmerisAPI.ChainReq): EmerisAPI.StakingParams => {
      return state.unstakingParams[params.chain_name] ?? null;
    },
  [GetterTypes.getUnbondingDelegations]:
    (state: APIState) =>
    (params: EmerisAPI.AddrReq): EmerisAPI.UnbondingDelegations | null => {
      return state.unbondingDelegations[params.address] ?? null;
    },
  [GetterTypes.getAllBalances]: (state: APIState, _getters, _rootState, rootGetters): EmerisAPI.Balances | null => {
    if (!rootGetters[GlobalUserGetterTypes.getAccount]) {
      return null;
    }

    const balances = Object.values(state.balances)
      .filter((balance) => balance !== null)
      .flat()
      .filter((balance) => rootGetters[GlobalUserGetterTypes.getKeyhashes].indexOf(balance.address) > -1)
      .filter((balance) => parseCoins(balance.amount)[0].amount != '0');
    return balances.length > 0 ? balances : null;
  },
  [GetterTypes.getAllValidPools]: (state: APIState): Pool[] => {
    return state.validPools;
  },
  [GetterTypes.getAllStakingBalances]: (state: APIState): EmerisAPI.StakingBalances | null => {
    const stakingBalances = Object.values(state.stakingBalances)
      .filter((balance) => balance !== null)
      .flat();
    return stakingBalances.length > 0 ? stakingBalances : null;
  },
  [GetterTypes.getAllUnbondingDelegations]: (state: APIState): EmerisAPI.UnbondingDelegations | null => {
    const unbondingDelegations = Object.values(state.unbondingDelegations)
      .filter((balance) => balance !== null)
      .flat();
    return unbondingDelegations.length > 0 ? unbondingDelegations : null;
  },
  [GetterTypes.getNumbersChain]:
    (state: APIState) =>
    (params: EmerisAPI.ChainAddrReq): EmerisAPI.SeqNumber | null => {
      return state.chainnumbers[params.chain_name][params.address] ?? null;
    },
  [GetterTypes.getChainAPR]:
    (state: APIState) =>
    (params: EmerisAPI.ChainReq): string => {
      return state.chains[params.chain_name].apr;
    },
  [GetterTypes.getFeeAddresses]: (state: APIState) => {
    const feeAddresses = [];
    for (const chain of Object.values(state.chains)) {
      feeAddresses.push({ chain_name: chain.chain_name, demeris_address: chain.demeris_addresses[0] });
    }
    return feeAddresses.length != 0 ? feeAddresses : null;
  },
  [GetterTypes.isVerified]:
    (state: APIState) =>
    (params: { denom: string; chain_name: string }): boolean => {
      return state.verifiedDenoms.find((x) => x.name == params.denom)?.verified ?? false;
    },
  [GetterTypes.getVerifiedDenoms]: (state: APIState): EmerisAPI.VerifiedDenoms | null => {
    return state.verifiedDenoms.length != 0 ? state.verifiedDenoms : null;
  },
  [GetterTypes.getTicker]:
    (state: APIState, getters) =>
    ({ name }): string => {
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
  [GetterTypes.getChainFromChainId]:
    (state: APIState) =>
    (chain_id: string): string => {
      return Object.values(state.chains).find((x) => x.node_info.chain_id == chain_id).chain_name;
    },
  [GetterTypes.getDisplayChain]:
    (state: APIState) =>
    (params: { name: string }): string => {
      return state.chains[params.name]?.display_name ?? null;
    },
  [GetterTypes.getDenomPrecision]: (state) => (params: { name: string }) => {
    return state.verifiedDenoms.find((x) => x.name == params.name)?.precision ?? null;
  },
  [GetterTypes.getChains]: (state: APIState): Record<string, EmerisAPI.Chain> => {
    return Object.keys(state.chains).length != 0 ? state.chains : null;
  },
  [GetterTypes.getPrices]: (state: APIState): EmerisAPI.Prices => {
    return state.prices;
  },
  [GetterTypes.getExchangeAmountFromATOMPool]:
    (state: APIState, getters) =>
    (base_denom: string): number => {
      const traces = getters[GlobalGetterTypes.API.getAllVerifiedTraces];
      const pools = getters[GlobalGetterTypes.API.getAllValidPools];

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

      const reserveBalances = getters[GlobalGetterTypes.API.getBalances]({
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
            precision: getters[GlobalGetterTypes.API.getDenomPrecision]({ name: baseDenom }) ?? 6,
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
  [GetterTypes.getPrice]:
    (state: APIState, getters) =>
    (params: { denom: string }): number => {
      const ticker = (getters[GlobalGetterTypes.API.getTicker]({ name: params.denom }) + 'USDT').toUpperCase();
      if (state.prices.Tokens.length == 0) {
        return;
      }
      const marketPrice = state.prices.Tokens.find((x) => x.Symbol == ticker)?.Price ?? null;

      if (marketPrice) {
        return marketPrice;
      }

      const exchangeAmountFromPool = getters[GlobalGetterTypes.API.getExchangeAmountFromATOMPool](params.denom);

      if (exchangeAmountFromPool) {
        const exchangedDenomPrecision = getters[GlobalGetterTypes.API.getDenomPrecision]({
          name: params.denom,
        });
        const ATOMPrice = getters[GlobalGetterTypes.API.getPrice]({ denom: 'uatom' });

        return exchangeAmountFromPool * ATOMPrice * 10 ** (exchangedDenomPrecision - 6);
      }

      return null;
    },
  [GetterTypes.getSupply]:
    (state: APIState, getters) =>
    (params): number => {
      const ticker = (getters[GlobalGetterTypes.API.getTicker]({ name: params.denom }) + 'USDT').toUpperCase();
      return state.prices.Tokens.find((x) => x.Symbol == ticker)?.Supply ?? null;
    },
  [GetterTypes.getEndpoint]: (state: APIState): string => {
    return state.endpoint;
  },
  [GetterTypes.getGitEndpoint]: (state: APIState): string => {
    return state.gitEndpoint;
  },
  [GetterTypes.getRawGitEndpoint]: (state: APIState): string => {
    return state.rawGitEndpoint;
  },
  [GetterTypes.getWebSocketEndpoint]: (state: APIState): string => {
    return state.wsEndpoint;
  },
  [GetterTypes.getDexChain]: (state: APIState): string => {
    return state.hub_chain;
  },
  [GetterTypes.getTxStatus]:
    (state: APIState) =>
    (params: EmerisAPI.TicketReq): Promise<EmerisAPI.TicketResponse> | null => {
      return state.transactions.get(JSON.stringify(params))?.promise ?? null;
    },
  [GetterTypes.getVerifyTrace]:
    (state: APIState) =>
    (params: EmerisAPI.VerifyTraceReq): EmerisAPI.VerifyTrace | null => {
      if (state.traces[params.chain_name]) {
        return state.traces[params.chain_name][params.hash] ?? null;
      } else {
        return null;
      }
    },
  [GetterTypes.getAllVerifiedTraces]: (state: APIState): Record<string, EmerisAPI.VerifyTrace> => {
    let result = {};
    for (const traces of Object.values(state.traces)) {
      result = {
        ...result,
        ...traces,
      };
    }
    return result;
  },
  [GetterTypes.getBech32Config]:
    (state: APIState) =>
    (params: EmerisAPI.ChainReq): EmerisBase.Bech32Config | null => {
      return state.chains[params.chain_name]?.node_info.bech32_config ?? null;
    },
  [GetterTypes.getFeeTokens]:
    (state: APIState) =>
    (params: EmerisAPI.ChainReq): EmerisBase.Denom[] | null => {
      return state.chains[params.chain_name]?.denoms?.filter((x) => x.fee_token) ?? [];
    },
  [GetterTypes.getChain]:
    (state: APIState) =>
    (params: EmerisAPI.ChainReq): EmerisAPI.Chain | null => {
      return state.chains[params.chain_name] ?? null;
    },
  [GetterTypes.getPrimaryChannel]:
    (state: APIState) =>
    (params: EmerisAPI.ChainCounterPartyReq): string | null => {
      return state.chains?.[params.chain_name]?.primary_channel[params.destination_chain_name] ?? null;
    },
  [GetterTypes.getPrimaryChannels]: (state: APIState) => (params) => {
    const channels = [];
    for (const channel of Object.values(state.chains[params.chain_name].primary_channel)) {
      channels.push(channel);
    }
    return channels.length != 0 ? channels : null;
  },
  [GetterTypes.getTokenPrices]: (state: APIState): ChartPrices | null => {
    return state.tokenPrices;
  },
  [GetterTypes.getAirdrops]: (state: APIState): EmerisAirdrops.Airdrop[] | null => {
    return state.airdrops;
  },
  [GetterTypes.getAirdropsStatus]: (state: APIState): LoadingState | null => {
    return state.airdropsStatus;
  },
  [GetterTypes.getSelectedAirdrop]: (state: APIState): EmerisAirdrops.Airdrop | null => {
    return state.selectedAirdrop;
  },
  [GetterTypes.getTokenPricesLoadingStatus]: (state: APIState) => {
    return state.tokenPricesLoadingStatus;
  },
  [GetterTypes.getChainStatus]:
    (state: APIState) =>
    (params: EmerisAPI.ChainReq): boolean => {
      if (featureRunning('USE_NEW_CHAINS_API')) return state.chains[params.chain_name]?.online;
      else return state.chains[params.chain_name]?.status;
    },
  [GetterTypes.getChainNameByBaseDenom]:
    (state: APIState) =>
    (params: EmerisAPI.DenomReq): string => {
      return Object.values(state.chains)?.find((chain) => {
        return chain.denoms?.find((denom) => denom.name === params.denom);
      })?.chain_name;
    },

  // Coingecko Getters
  [GetterTypes.getCoinGeckoId]: (state: APIState): string | null => {
    return state.coinGeckoId;
  },
  [GetterTypes.getCoinGeckoIdLoadingStatus]: (state: APIState) => {
    return state.coinGeckoIdLoadingStatus;
  },
};
