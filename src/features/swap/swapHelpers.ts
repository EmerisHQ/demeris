import { EmerisBase } from '@emeris/types';
import BigNumber from 'bignumber.js';
import groupBy from 'lodash.groupby';
import orderBy from 'lodash.orderby';

import { GlobalGetterTypes } from '@/store';
import { getBaseDenomSync } from '@/utils/actionHandler';
import { isNative, parseCoins } from '@/utils/basic';
import { useStore } from '@/utils/useStore';

import { SwapContext } from './swapMachine';

export const denomBalancesPerChain = (context: SwapContext, denom: string) => {
  const balances = context.balances.filter((item) => item.base_denom === denom);
  return groupBy(balances, 'on_chain');
};

export const totalDenomBalance = (context: SwapContext, denom: string, chain?: string) => {
  let balances = context.balances.filter((item) => item.base_denom === getBaseDenomSync(denom));

  if (chain) {
    balances = balances.filter((item) => item.on_chain === chain);
  }

  let total = new BigNumber(0);

  for (const balance of balances) {
    const amount = parseCoins(balance.amount)[0].amount;
    total = total.plus(amount);
  }

  return total.toString();
};

export const getMaxAmount = (context: SwapContext) => {
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

export const getInputAmountFromRoute = (context: SwapContext, routeIndex?: number) => {
  const index = routeIndex ?? context.selectedRouteIndex;
  const route = context.data.routes?.[index];

  if (!route?.steps) return;

  const firstStep = route.steps[0];
  return {
    amount: 0,
    ...firstStep?.data?.from,
  };
};

export const getOutputAmountFromRoute = (context: SwapContext, routeIndex?: number) => {
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

export const isBestRouteSelected = (context: SwapContext) => {
  return context.selectedRouteIndex === 0 && !!getCurrentRoute(context);
};

export const getChainFromProtocol = (protocol: string) => {
  const protocols = {
    osmosis: 'osmosis',
    gravity: 'cosmos-hub',
  };
  return protocols[protocol];
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

export const getChainFromDenom = (denom: string) => {
  const chain = useStore().getters[GlobalGetterTypes.API.getVerifiedDenoms]?.find((x) => x.name === denom)?.chain_name;
  if (chain) return chain;

  const traces: Record<string, any> = useStore().getters[GlobalGetterTypes.API.getAllVerifiedTraces];
  const trace = traces[denom.split('/')[1]?.toUpperCase()];

  if (trace) {
    return trace.trace[0].chain_name;
  }

  return undefined;
};

export const getRouteDetails = (context: SwapContext, routeIndex: number) => {
  const result = context.data.routes[routeIndex]?.steps.map((step) => {
    const data = step.data;
    const chainIn = getChainFromDenom(data.from.denom) ?? getChainFromProtocol(step.protocol);
    const chainOut = getChainFromDenom(data.to.denom) ?? getChainFromProtocol(step.protocol);
    const baseDenomIn = getBaseDenomSync(data.from.denom);
    const baseDenomOut = getBaseDenomSync(data.to.denom);

    return {
      ...step,
      chainIn,
      chainOut,
      baseDenomIn,
      baseDenomOut,
    };
  });

  // Aggregate related denom steps in the same array
  const steps = [];
  let groupedStep = [result[0]];

  for (let index = 1; index < result.length; index++) {
    if (groupedStep[0]?.baseDenomIn === result[index].baseDenomIn) {
      groupedStep.push(result[index]);
    } else {
      // Denom transition
      steps.push(groupedStep);
      groupedStep = [result[index]];

      // Last step
      if (index === result.length - 1) {
        steps.push(groupedStep);
      }
    }
  }

  return steps;
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
