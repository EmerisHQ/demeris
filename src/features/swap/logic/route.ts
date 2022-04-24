/* eslint-disable max-lines-per-function */
import { EmerisBase, EmerisDEXInfo } from '@emeris/types';

import { move } from '@/actionhandler/actions/move';
import { Step } from '@/types/actions';
import { isNative } from '@/utils/basic';

import { SwapContext } from '../state/machine';
import { calculateSlippage, getOrderPrice } from './amount';
import { getChainFromDenom, resolveBaseDenom } from './denom';
import { chunkBy } from './utils';

export const getInputAmountFromRoute = (context: SwapContext, routeIndex?: number) => {
  const index = routeIndex ?? context.selectedRouteIndex;
  const route = context.data.routes?.[index];

  const firstStep = route.steps[0];

  if (firstStep?.data.from.amount === undefined) {
    return { amount: '0', denom: firstStep.data.from.denom };
  }

  return {
    amount: 0,
    ...firstStep?.data?.from,
  };
};

export const getOutputAmountFromRoute = (context: SwapContext, routeIndex?: number): EmerisBase.Amount => {
  const index = routeIndex ?? context.selectedRouteIndex;
  const route = context.data.routes?.[index];

  const lastStep = route.steps[route.steps.length - 1];

  if (lastStep?.data.to.amount === undefined) {
    return { amount: '0', denom: lastStep.data.to.denom };
  }

  const numSwaps = countSwapsFromRoute(route);
  const amount = calculateSlippage(lastStep.data.to.amount, +context.maxSlippage, numSwaps);

  return {
    amount,
    denom: lastStep.data.to.denom,
  };
};

export const getOrderPriceFromRoute = (context: SwapContext, routeIndex?: number) => {
  const index = routeIndex ?? context.selectedRouteIndex;
  const route = context.data.routes?.[index];

  const firstStep = route.steps[0];
  const lastStep = route.steps[route.steps.length - 1];

  return getOrderPrice(firstStep.data.from.amount, lastStep.data.to.amount);
};

export const getLimitPriceFromRoute = (context: SwapContext, routeIndex?: number) => {
  const index = routeIndex ?? context.selectedRouteIndex;
  const route = context.data.routes?.[index];

  const amount = getOrderPriceFromRoute(context, index);
  const numSwaps = countSwapsFromRoute(route);

  return calculateSlippage(amount, +context.maxSlippage, numSwaps);
};

export const getOutputChainFromRoute = (context: SwapContext, routeIndex?: number) => {
  const index = routeIndex ?? context.selectedRouteIndex;
  const route = context.data.routes?.[index];

  if (!route?.steps) return;

  const lastStep = route.steps[route.steps.length - 1];
  return getChainFromDenom(context, lastStep.data.to.denom);
};

export const getProtocolFromStep = (step: any) => {
  return step.protocol ?? step?.data?.pool_id?.split('/')[0];
};

export const getProtocolFromRoute = (route: any) => {
  return getProtocolFromStep(route?.steps?.[0]);
};

export const getProtocolsFromRoute = (route: any) => {
  const protocols = [];
  for (const step of route?.steps) {
    const protocol = getProtocolFromStep(step);
    if (protocols.includes(protocol)) continue;
    protocols.push(protocol);
  }
  return protocols;
};

export const getCurrentRoute = (context: SwapContext) => {
  return context.data.routes[context.selectedRouteIndex];
};

export const isBestRouteSelected = (context: SwapContext) => {
  return context.selectedRouteIndex === 0 && getCurrentRoute(context) !== undefined;
};

export const countTransactionsFromRoute = (context: SwapContext, routeIndex: number) => {
  const route = context.data.routes[routeIndex];
  if (!route) return;

  return route.steps.length;
};

export const countChainsFromRoute = (context: SwapContext, routeIndex: number) => {
  const route = context.data.routes[routeIndex];
  if (!route) return;

  const chains = [];
  for (const details of getDetailsFromRoute(context, routeIndex)) {
    for (const item of details) {
      if (chains.includes(item.chainIn)) continue;
      chains.push(item.chainIn);
    }
  }

  return chains.length;
};

export const getDetailsFromRoute = (context: SwapContext, routeIndex: number) => {
  const result = context.data.routes[routeIndex]?.steps.map((step) => {
    const data = step.data;
    const chainIn = getChainFromDenom(context, data.from.denom);
    const chainOut = getChainFromDenom(context, data.to.denom);
    const baseDenomIn = resolveBaseDenom(data.from.denom, { context });
    const baseDenomOut = resolveBaseDenom(data.to.denom, { context });

    return {
      ...step,
      chainIn,
      chainOut,
      baseDenomIn,
      baseDenomOut,
    };
  });

  const chunks = chunkBy<any>(result, (item) => item.baseDenomIn);

  return chunks;
};

export const countSwapsFromRoute = (route: any) => {
  return route?.steps?.filter((step) => step.type === EmerisDEXInfo.SwapType.Pool).length;
};

export const countExchangesFromRoutes = (context: SwapContext) => {
  const protocols = [];
  for (const route of context.data.routes) {
    for (const step of route.steps) {
      if (protocols.includes(step.protocol)) continue;
      protocols.push(step.protocol);
    }
  }
  return protocols.length;
};

export const removeExceedingTransactionsFromRoutes = (routes: any[]) => {
  const result = [];
  for (const route of routes) {
    const lastSwapIndex = route.steps.map((item) => item.type).lastIndexOf('pool');
    route.steps = route.steps.slice(0, lastSwapIndex + 1);

    result.push(route);
  }
  return result;
};

export const convertRouteToSteps = async (context: SwapContext, routeIndex: number): Promise<Step[]> => {
  const route = context.data.routes[routeIndex];
  if (!route) return [];

  const txs: Step[] = [];

  const formatToValidDenom = (denom: string) => {
    if (isNative(denom)) return denom;
    const [prefix, hash] = denom.split('/');
    return `${prefix}/${hash.toUpperCase()}`;
  };

  for (const step of route.steps) {
    if (step.type === 'ibc') {
      const result = await move({
        amount: {
          amount: step.data.from.amount,
          denom: formatToValidDenom(step.data.from.denom),
        },
        chain_name: getChainFromDenom(context, step.data.from.denom),
        destination_chain_name: getChainFromDenom(context, step.data.to.denom),
      });

      txs.push({
        name: 'move',
        description: '',
        transactions: result.steps,
      });
    }

    if (step.type === 'pool') {
      txs.push({
        name: 'swap',
        description: '',
        transactions: [
          {
            status: 'pending',
            type: 'swap',
            protocol: step.protocol,
            data: {
              from: {
                amount: step.data.from.amount,
                denom: formatToValidDenom(step.data.from.denom),
              },
              to: {
                amount: step.data.to.amount,
                denom: formatToValidDenom(step.data.to.denom),
              },
              pool: {
                id: step.data.pool_id.split('/')[1],
                type_id: 1,
              },
              chainName: getChainFromDenom(context, step.data.from.denom),
            },
          },
        ],
      });
    }
  }

  return txs;
};
