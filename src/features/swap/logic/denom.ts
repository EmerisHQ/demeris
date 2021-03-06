import { EmerisDEXInfo } from '@emeris/types';
import groupBy from 'lodash.groupby';
import orderBy from 'lodash.orderby';

import { GlobalGetterTypes } from '@/store';
import { getBaseDenomSync } from '@/utils/actionHandler';
import { isNative } from '@/utils/basic';
import { useStore } from '@/utils/useStore';

import { SwapCoin, SwapContext } from '../state/machine';
import { amountToHuman, totalDenomBalance } from './amount';
import { getChainFromProtocol } from './protocol';

export const denomBalancesPerChain = (context: SwapContext, denom: string) => {
  const balances = context.balances.filter((item) => item.base_denom === denom);
  return groupBy(balances, 'on_chain');
};

export const getDenomFromBaseDenom = (context: SwapContext, baseDenom: string, chain: string) => {
  const traces: Record<string, any> = useStore().getters[GlobalGetterTypes.API.getAllVerifiedTraces];
  for (const trace of Object.values(traces)) {
    if (trace.base_denom === baseDenom) {
      for (const item of trace.trace) {
        if (item.chain_name === chain) {
          return trace.ibc_denom;
        }
      }
    }
  }

  const availableDenom = getAvailableDenoms(context).find(
    (item) => item.baseDenom === baseDenom && item.chain === chain,
  )?.denom;

  if (availableDenom) return availableDenom;

  const swaps = context.data.swaps.find((item) => item.chainId === chain && item.denomA.baseDenom === baseDenom)?.denomA
    .denom;

  return swaps ?? baseDenom;
};

export const getChainFromDenom = (context: SwapContext, denom: string, protocol?: string) => {
  const chain = useStore().getters[GlobalGetterTypes.API.getChainNameByBaseDenom]({ denom });
  if (chain) return chain;

  let trace;

  if (protocol) {
    const hash = denom.split('/')[1];
    trace = useStore().getters[GlobalGetterTypes.API.getVerifyTrace]({
      chain_name: getChainFromProtocol(protocol),
      hash,
    });
  }

  if (!trace) {
    const traces: Record<string, any> = useStore().getters[GlobalGetterTypes.API.getAllVerifiedTraces];
    trace = traces[denom.split('/')[1]?.toUpperCase()];
  }

  if (trace?.trace?.[0]) {
    return trace.trace[0].chain_name;
  }

  return getAvailableDenoms(context).find((item) => item.denom === denom)?.chain;
};

export const getVerifiedDenoms = () => {
  const verifiedDenoms = useStore().getters[GlobalGetterTypes.API.getVerifiedDenoms];
  return verifiedDenoms.map((denom) => ({ denom: denom.name, baseDenom: denom.name, chain: denom.chain_name }));
};

// TODO: Remove after daggregation returns all correct steps
export const getAvailableDenoms = (context: SwapContext) => {
  return context.data.availableDenoms?.map((item) => {
    const [chain, ...rest] = item.split('/');
    const denom = rest.join('/');
    const baseDenom = getBaseDenomSync(denom);

    return {
      baseDenom,
      chain,
      denom,
    };
  });
};

export const resolveCoinToSupportedDex = (context: SwapContext, coin: SwapCoin) => {
  if (!coin) return;
  const inputKey = [coin.chain, coin.denom].join('/');

  if (context.data.availableDenoms.indexOf(inputKey) === -1) {
    const defaultDexChain = EmerisDEXInfo.DEX.Osmosis;
    return {
      denom: getDenomFromBaseDenom(context, coin.baseDenom, defaultDexChain),
      chain: defaultDexChain,
      baseDenom: coin.baseDenom,
    };
  }

  return coin;
};

export const getAvailableInputAssets = (context: SwapContext) => {
  const denoms = getVerifiedDenoms();

  const results = denoms
    .map(({ baseDenom, denom, chain }) => {
      const config = useStore().getters[GlobalGetterTypes.API.getVerifiedDenoms].find((x) => x.name === baseDenom);

      const isVerified = config?.verified ?? false;
      const displayName = config?.display_name;
      const totalBalance = totalDenomBalance(context, baseDenom);
      const humanBalance = amountToHuman({ amount: totalBalance, denom: baseDenom }).amount;

      return {
        baseDenom,
        chain,
        denom,
        displayName,
        isVerified,
        totalBalance,
        humanBalance,
      };
    })
    .filter((x) => !x.baseDenom.startsWith('pool'));

  return orderBy(results, [(x) => (x.humanBalance === '-' ? 0 : +x.humanBalance), 'displayName'], ['desc', 'asc']);
};

export const getAvailableChainsByDenom = (context: SwapContext, baseDenom: string) => {
  return Object.keys(denomBalancesPerChain(context, baseDenom));
};

export const getDefaultInputCoin = (context: SwapContext) => {
  let coin: SwapCoin;
  const availableAssets = getVerifiedDenoms();
  const defaultDenom = context.defaultInputDenom;

  if (defaultDenom) {
    if (!coin) {
      coin = availableAssets.find((item) => item.baseDenom === defaultDenom);
    }
  }

  if (!coin) {
    coin = {
      denom: 'uatom',
      chain: 'cosmos-hub',
      baseDenom: 'uatom',
    };
  }

  return coin;
};

export const getDenomPropertiesFromSwaps = (swaps: EmerisDEXInfo.Swaps, denom: string) => {
  const result = swaps.find((item) => item.denomA.denom === denom)?.denomA;

  if (result) return result;

  return swaps.find((item) => item.denomB.denom === denom)?.denomB;
};

export const resolveBaseDenom = (denom: string, base: { context?: SwapContext; swaps?: EmerisDEXInfo.Swaps } = {}) => {
  let swaps: EmerisDEXInfo.Swaps = [];

  if (base.swaps) swaps = base.swaps;
  if (base.context) swaps = base.context.data.swaps;

  const props = getDenomPropertiesFromSwaps(swaps, denom);
  if (props?.baseDenom) return props.baseDenom;

  return getBaseDenomSync(denom);
};

export const resolveDisplayName = (baseDenom: string) => {
  const config = useStore().getters[GlobalGetterTypes.API.getVerifiedDenoms].find((x) => x.name === baseDenom);
  return config?.display_name;
};

export const normalizeDenom = (denom: string) => {
  if (isNative(denom)) return denom;
  const [prefix, hash] = denom.split('/');
  return `${prefix}/${hash.toUpperCase()}`;
};

export const getMarketCap = (denom: string) => {
  const price = useStore().getters[GlobalGetterTypes.API.getPrice]({ denom });
  const supply = useStore().getters[GlobalGetterTypes.API.getSupply]({ denom });
  const marketCap = price * supply;
  return marketCap;
};
