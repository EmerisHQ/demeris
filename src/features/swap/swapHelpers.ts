import { EmerisBase } from '@emeris/types';
import BigNumber from 'bignumber.js';
import groupBy from 'lodash.groupby';
import orderBy from 'lodash.orderby';

import { move } from '@/actionhandler/actions/move';
import { GlobalGetterTypes } from '@/store';
import { Step } from '@/types/actions';
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

export const getMaxInputAmount = (context: SwapContext) => {
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

export const getMinInputValue = () => {
  return 10;
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

export const getProtocolFromStep = (step: any) => {
  return step.protocol ?? step?.data?.pool_id?.split('/')[0];
};

export const getProtocolFromRoute = (route: any) => {
  return getProtocolFromStep(route?.steps?.[0]);
};

export const getCurrentRoute = (context: any) => {
  return context.data.routes[context.selectedRouteIndex];
};

export const formatProtocolName = (protocol: string) => {
  const protocols = {
    osmosis: 'Osmosis',
    gravity: 'Gravity Dex',
    crescent: 'Crescent',
  };
  return protocols[protocol] ?? 'Unknown';
};

export const isBestRouteSelected = (context: SwapContext) => {
  return context.selectedRouteIndex === 0 && getCurrentRoute(context) !== undefined;
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

  const chunks = chunkBy<any>(result, (item) => item.baseDenomIn);

  return chunks;
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
        chain_name: getChainFromDenom(step.data.from.denom, step.protocol),
        destination_chain_name: getChainFromDenom(step.data.to.denom, step.protocol),
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
              chainName: getChainFromDenom(step.data.from.denom),
            },
          },
        ],
      });
    }
  }

  return txs;
};

export const getOrderPrice = (context: SwapContext) => {
  return new BigNumber(context.outputAmount).dividedBy(context.inputAmount).toString();
};

export const getLimitPrice = (context: SwapContext) => {
  const precision =
    useStore().getters[GlobalGetterTypes.API.getDenomPrecision]({ name: context.outputCoin.baseDenom }) ?? 6;
  return new BigNumber(getOrderPrice(context))
    .multipliedBy(1 - 0.005)
    .decimalPlaces(precision)
    .toString();
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