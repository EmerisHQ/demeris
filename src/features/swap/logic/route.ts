/* eslint-disable max-lines-per-function */
import { EmerisBase, EmerisDEXInfo } from '@emeris/types';
import BigNumber from 'bignumber.js';

import { move } from '@/actionhandler/actions/move';
import { Step, SwapStepTx } from '@/types/actions';

import { SwapContext } from '../state/machine';
import { amountToHuman, calculateSlippage, getOrderPrice } from './amount';
import { getChainFromDenom, normalizeDenom, resolveBaseDenom } from './denom';
import { getChainFromProtocol } from './protocol';
import { chunkBy } from './utils';

export const getInputAmountFromRoute = (context: SwapContext, routeIndex?: number) => {
  const index = routeIndex ?? context.selectedRouteIndex;
  const route = context.data.routes?.[index];

  const firstStep = route.steps[0];

  if (firstStep?.data.from.amount === undefined || isNaN(firstStep?.data.to.amount)) {
    return { amount: '0', denom: firstStep.data.from.denom };
  }

  return firstStep.data.from;
};

export const getOutputAmountFromRoute = (context: SwapContext, routeIndex?: number): EmerisBase.Amount => {
  const index = routeIndex ?? context.selectedRouteIndex;
  const route = context.data.routes?.[index];

  const lastStep = route.steps[route.steps.length - 1];

  if (lastStep?.data.to.amount === undefined || isNaN(lastStep?.data.to.amount)) {
    return { amount: '0', denom: lastStep.data.to.denom };
  }

  return lastStep.data.to;
};

export const getOrderPriceFromRoute = (context: SwapContext, routeIndex?: number) => {
  const index = routeIndex ?? context.selectedRouteIndex;
  const route = context.data.routes?.[index];

  const firstStep = route.steps[0];
  const lastStep = route.steps[route.steps.length - 1];

  const from = {
    denom: resolveBaseDenom(firstStep.data.from.denom, { context }),
    amount: firstStep.data.from.amount,
  };

  const to = {
    denom: resolveBaseDenom(lastStep.data.to.denom, { context }),
    amount: lastStep.data.to.amount,
  };

  return getOrderPrice(from, to);
};

export const getLimitPriceFromRoute = (context: SwapContext, routeIndex?: number) => {
  const index = routeIndex ?? context.selectedRouteIndex;
  const route = context.data.routes?.[index];

  const amount = new BigNumber(getOrderPriceFromRoute(context, index)).shiftedBy(4).toString();
  const numSwaps = countSwapsFromRoute(route);

  const output = calculateSlippage(amount, +context.maxSlippage, { factor: numSwaps });
  return new BigNumber(output).shiftedBy(-4).toString();
};

export const getMinOutputAmountFromRoute = (context: SwapContext, routeIndex?: number) => {
  const index = routeIndex ?? context.selectedRouteIndex;
  const route = context.data.routes?.[index];

  const { amount, denom } = getOutputAmountFromRoute(context, index);
  const numSwaps = countSwapsFromRoute(route);
  const output = calculateSlippage(amount, +context.maxSlippage, { factor: numSwaps });

  return amountToHuman({ amount: output, denom }).amount;
};

export const getOutputChainFromRoute = (context: SwapContext, routeIndex?: number) => {
  const index = routeIndex ?? context.selectedRouteIndex;
  const route = context.data.routes?.[index];

  if (!route?.steps) return;

  const lastStep = route.steps[route.steps.length - 1];
  return getChainFromDenom(context, lastStep.data.to.denom, getProtocolFromStep(lastStep));
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

  return aggregateRouteSteps(route.steps).length;
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
    const chainIn = getChainFromDenom(context, data.from.denom, getProtocolFromStep(step));
    const chainOut = getChainFromDenom(context, data.to.denom, getProtocolFromStep(step));
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

  return aggregateRouteSteps(result);
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

export const removeExceedingStepsFromRoutes = (routes: any[]) => {
  const result = [];
  for (const route of routes) {
    const lastSwapIndex = route.steps.map((item) => item.type).lastIndexOf('pool');
    route.steps = route.steps.slice(0, lastSwapIndex + 1);

    result.push(route);
  }
  return result;
};

export const aggregateRouteSteps = (steps: any[]) => {
  return chunkBy<any>(steps, (step) => {
    if (step.protocol === EmerisDEXInfo.DEX.Osmosis) {
      return step.type === EmerisDEXInfo.SwapType.Pool;
    }
    return false;
  });
};

// Include a new step to transfer funds from a chain to the DEX chain before other steps
// TODO: This is a temporary solution until daggregation returns all correct steps
export const prependAdditionalStepsToRoutes = (routes: any[], inputCoin: any, targetCoin: any) => {
  const result = [];
  for (const route of routes) {
    const steps = [
      {
        type: 'ibc',
        data: {
          from: {
            denom: inputCoin.denom,
            amount: route.steps[0].data.from.amount,
          },
          to: {
            denom: targetCoin.denom,
            amount: route.steps[0].data.from.amount,
          },
        },
        protocol: targetCoin.chain,
      },
    ];

    route.steps = steps.concat(route.steps);
    result.push(route);
  }
  return result;
};

export const prepareRouteToSign = async (context: SwapContext, routeIndex: number): Promise<Step[]> => {
  const route = context.data.routes[routeIndex];
  if (!route) return [];

  const steps: Step[] = [];

  const createSwapTx = (routeSteps): SwapStepTx => {
    return {
      status: 'pending',
      type: 'swap',
      protocol: routeSteps[0].protocol,
      data: routeSteps.map((routeStep) => ({
        from: {
          amount: routeStep.data.from.amount,
          denom: normalizeDenom(routeStep.data.from.denom),
        },
        to: {
          amount: routeStep.data.to.amount,
          denom: normalizeDenom(routeStep.data.to.denom),
        },
        pool: {
          id: routeStep.data.pool_id.split('/')[1],
          type_id: 1,
        },
        chainName: getChainFromProtocol(routeStep.protocol),
      })),
    };
  };

  for (const routeSteps of aggregateRouteSteps(route.steps)) {
    const isMultiHopSwap = routeSteps.length > 1 && routeSteps[0].type === EmerisDEXInfo.SwapType.Pool;

    if (isMultiHopSwap) {
      steps.push({
        name: 'swap',
        description: '',
        transactions: [createSwapTx(routeSteps)],
      });
      continue;
    }

    for (const routeStep of routeSteps) {
      if (routeStep.type === 'ibc') {
        const result = await move({
          amount: {
            amount: routeStep.data.from.amount,
            denom: normalizeDenom(routeStep.data.from.denom),
          },
          chain_name: getChainFromDenom(context, routeStep.data.from.denom, getProtocolFromStep(routeStep)),
          destination_chain_name: getChainFromDenom(context, routeStep.data.to.denom, getProtocolFromStep(routeStep)),
        });

        steps.push({
          name: 'move',
          description: '',
          transactions: result.steps,
        });
      }

      if (routeStep.type === 'pool') {
        steps.push({
          name: 'swap',
          description: '',
          transactions: [createSwapTx([routeStep])],
        });
      }
    }
  }

  return steps;
};
