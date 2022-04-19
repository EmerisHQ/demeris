import { EmerisDEXInfo } from '@emeris/types';
import groupBy from 'lodash.groupby';
import orderBy from 'lodash.orderby';

import { GlobalGetterTypes } from '@/store';
import { getBaseDenom, getBaseDenomSync } from '@/utils/actionHandler';
import { isNative } from '@/utils/basic';
import { useStore } from '@/utils/useStore';

import { SwapCoin, SwapContext } from '../state/machine';
import { amountToHuman, totalDenomBalance } from './amount';

export const denomBalancesPerChain = (context: SwapContext, denom: string) => {
  const balances = context.balances.filter((item) => item.base_denom === denom);
  return groupBy(balances, 'on_chain');
};

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

export const getDenomFromBaseDenom = (denom: string, chain: string) => {
  const traces: Record<string, any> = useStore().getters[GlobalGetterTypes.API.getAllVerifiedTraces];
  for (const trace of Object.values(traces)) {
    if (trace.base_denom === denom) {
      for (const item of trace.trace) {
        if (item.chain_name === chain) {
          return trace.ibc_denom;
        }
      }
    }
  }
  return denom;
};

export const getChainFromDenom = (context: SwapContext, denom: string) => {
  const chain = useStore().getters[GlobalGetterTypes.API.getVerifiedDenoms]?.find((x) => x.name === denom)?.chain_name;
  if (chain) return chain;

  const traces: Record<string, any> = useStore().getters[GlobalGetterTypes.API.getAllVerifiedTraces];
  const trace = traces[denom.split('/')[1]?.toUpperCase()];

  if (trace?.trace) {
    return trace.trace[0].chain_name;
  }

  const ctx = getAvailableDenoms(context).find((item) => item.denom === denom);

  if (ctx) {
    // Background sync traces
    getBaseDenom(denom, ctx.chain);
    return ctx.chain;
  }

  return undefined;
};

export const getAvailableInputAssets = (context: SwapContext) => {
  const denoms = getAvailableDenoms(context).filter((item) => isNative(item.denom));
  const results = denoms.map(({ baseDenom, denom, chain }) => {
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
  });

  return orderBy(results, [(x) => +x.humanBalance, 'displayName'], ['desc', 'asc']);
};

export const getAvailableChainsByDenom = (context: SwapContext, baseDenom: string) => {
  return getAvailableDenoms(context)
    .filter((item) => item.baseDenom === baseDenom)
    .map((item) => item.chain);
};

export const getDefaultInputCoin = (context: SwapContext) => {
  let coin: SwapCoin;
  const availableAssets = getAvailableDenoms(context);
  const defaultDenom = context.defaultInputDenom;

  if (defaultDenom) {
    coin = availableAssets.find((item) => item.denom === defaultDenom);

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

export const resolveBaseDenom = (denom: string, base: { context?: SwapContext; swaps?: EmerisDEXInfo.Swaps }) => {
  let swaps: EmerisDEXInfo.Swaps = [];

  if (base.swaps) swaps = base.swaps;
  if (base.context) swaps = base.context.data.swaps;

  const props = getDenomPropertiesFromSwaps(swaps, denom);
  if (props?.baseDenom) return props.baseDenom;

  return getBaseDenomSync(denom);
};
