/* eslint-disable max-lines-per-function */
import { move } from '@/actionhandler/actions/move';
import { Step } from '@/types/actions';
import { isNative } from '@/utils/basic';

import { SwapContext } from '../state/machine';
import { getChainFromDenom, resolveBaseDenom } from './denom';

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

export const getCurrentRoute = (context: any) => {
  return context.data.routes[context.selectedRouteIndex];
};

export const isBestRouteSelected = (context: SwapContext) => {
  return context.selectedRouteIndex === 0 && getCurrentRoute(context) !== undefined;
};

/* Aggregate related items into the same array
 */
export const chunkBy = <T>(items: T[], fn: (item: T) => any): T[][] => {
  const chunks: T[][] = [];
  let chunkValue: unknown;

  items.forEach((item, i) => {
    const value = fn(item);

    if (value !== chunkValue || i === 0) {
      chunks.push([]);
      chunkValue = value;
    }

    const chunk = chunks[chunks.length - 1];

    chunk.push(item);
  });

  return chunks;
};

export const countTransactiosnFromRoute = (context: SwapContext, routeIndex: number) => {
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
