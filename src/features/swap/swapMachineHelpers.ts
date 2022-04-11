import { EmerisBase } from '@emeris/types';
import BigNumber from 'bignumber.js';
import groupBy from 'lodash.groupby';
import orderBy from 'lodash.orderby';

import { GlobalGetterTypes } from '@/store';
import { getBaseDenomSync } from '@/utils/actionHandler';
import { isNative, parseCoins } from '@/utils/basic';
import { useStore } from '@/utils/useStore';

export const denomBalancesPerChain = (context: any, denom: string) => {
  const balances = context.balances.filter((item) => item.base_denom === denom);
  return groupBy(balances, 'on_chain');
};

export const totalDenomBalance = (context: any, denom: string, chain?: string) => {
  let balances = context.balances.filter((item) => item.base_denom === getBaseDenomSync(denom));

  if (chain) {
    balances = balances.filter((item) => item.on_chain === chain);
  }

  let total = new BigNumber(0);

  for (const balance of balances) {
    const amount = parseCoins(balance.amount)[0].amount;
    total = total.plus(amount);
  }

  return total.toNumber();
};

export const getMaxAmount = (context: any) => {
  const inputCoin = context.inputCoin;

  if (!inputCoin?.denom) {
    return;
  }

  // Reduce fee
  const total = totalDenomBalance(context, inputCoin.denom, inputCoin.chain);

  return {
    denom: getBaseDenomSync(inputCoin.denom),
    amount: total,
  };
};

export const amountToHuman = ({ amount, denom }: EmerisBase.Amount) => {
  const precision = useStore().getters[GlobalGetterTypes.API.getDenomPrecision]({ name: denom }) ?? 6;
  return {
    amount: new BigNumber(amount).shiftedBy(-precision).decimalPlaces(precision).toString(),
    denom,
  };
};

export const amountToUnit = ({ amount, denom }: EmerisBase.Amount) => {
  const precision = useStore().getters[GlobalGetterTypes.API.getDenomPrecision]({ name: denom }) ?? 6;
  const amountBN = new BigNumber(amount);

  const value = amountBN.isPositive() ? new BigNumber(amount).shiftedBy(precision) : 0;

  return {
    amount: value.toString(),
    denom,
  };
};

export const getInputAmountFromRoute = (context: any, routeIndex?: number) => {
  const index = routeIndex ?? context.selectedRouteIndex;
  const route = context.data.routes?.[index];

  if (!route?.steps) return;

  const firstStep = route.steps[0];
  return {
    amount: 0,
    ...firstStep?.data?.from,
  };
};

export const getOutputAmountFromRoute = (context: any, routeIndex?: number) => {
  const index = routeIndex ?? context.selectedRouteIndex;
  const route = context.data.routes?.[index];

  if (!route?.steps) return;

  const lastStep = route.steps[route.steps.length - 1];
  return {
    amount: 0,
    ...lastStep?.data?.to,
  };
};

export const getProtocolFromRoute = (route: any) => {
  return route.steps[0].protocol;
};

export const getCurrentRoute = (context: any) => {
  return context.data.routes[context.selectedRouteIndex];
};

export const formatProtocolName = (protocol: string) => {
  const protocols = {
    osmosis: 'Osmosis',
    gravity: 'Gravity Dex',
  };
  return protocols[protocol];
};

export const isBestRouteSelected = (context: any) => {
  return context.selectedRouteIndex === 0;
};

export const getChainFromProtocol = (protocol: string) => {
  const protocols = {
    osmosis: 'osmosis',
    gravity: 'cosmos-hub',
  };
  return protocols[protocol];
};

export const getAvailableDenoms = (context) => {
  return context.data.availableDenoms?.map((item) => {
    const [chain, ...rest] = item.split('/');
    const denom = rest.join('/');

    return {
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

export const getAvailableAssets = (context: any) => {
  const result = getAvailableDenoms(context).map(({ denom, chain }) => {
    const baseDenom = getBaseDenomSync(denom);

    const config = useStore().getters[GlobalGetterTypes.API.getVerifiedDenoms].find((x) => x.name === baseDenom);

    const isVerified = config?.verified ?? false;
    const isNativeDenom = isNative(denom);
    const displayName = config?.display_name;
    const totalBalance = totalDenomBalance(context, baseDenom);
    const humanBalance = amountToHuman({ amount: totalBalance.toString(), denom: baseDenom }).amount;

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
