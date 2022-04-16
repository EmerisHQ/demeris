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

export const getChainFromDenom = (denom: string, protocol?: string) => {
  const chain = useStore().getters[GlobalGetterTypes.API.getVerifiedDenoms]?.find((x) => x.name === denom)?.chain_name;
  if (chain) return chain;

  const traces: Record<string, any> = useStore().getters[GlobalGetterTypes.API.getAllVerifiedTraces];
  const trace = traces[denom.split('/')[1]?.toUpperCase()];

  if (trace?.trace) {
    return trace.trace[0].chain_name;
  }

  if (protocol) {
    return getChainFromProtocol(protocol);
  }

  return undefined;
};

export const getAvailableAssets = (context: SwapContext) => {
  const result = getAvailableDenoms(context).map(({ baseDenom, denom, chain }) => {
    const config = useStore().getters[GlobalGetterTypes.API.getVerifiedDenoms].find((x) => x.name === baseDenom);

    const isVerified = config?.verified ?? false;
    const isNativeDenom = isNative(denom);
    const displayName = config?.display_name;
    const totalBalance = totalDenomBalance(context, baseDenom);
    const humanBalance = amountToHuman({ amount: totalBalance, denom: baseDenom }).amount;

    return {
      baseDenom,
      chain,
      denom,
      displayName,
      isVerified,
      isNativeDenom,
      totalBalance,
      humanBalance,
    };
  });

  return orderBy(
    result.filter((item) => item.isNativeDenom),
    [(x) => +x.humanBalance, 'displayName'],
    ['desc', 'asc'],
  );
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
