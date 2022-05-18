/* eslint-disable max-lines-per-function */
import { EmerisDEXInfo } from '@emeris/types';
import axios from 'axios';

import { GlobalGetterTypes } from '@/store';
import { appLogger } from '@/utils/logging';
import { useStore } from '@/utils/useStore';

import { SwapContext } from '../state';
import { amountToUnit } from './amount';
import { calculateInputAmountWithTransactionFees } from './fee';

export const fetchDexInfoSwaps = async (): Promise<EmerisDEXInfo.Swaps> => {
  const endpoint = useStore().getters[GlobalGetterTypes.API.getEndpoint];
  const { data } = await axios.get(`${endpoint}/dexinfo/swaps`);
  return data.swaps;
};

export const fetchSwapRoutes = async (context: SwapContext, direction?: string) => {
  const endpoint = useStore().getters[GlobalGetterTypes.API.getEndpoint];
  const inputDex = context.inputCoinDex;
  if (!inputDex) throw new Error('Empty routes');

  const gasPriceLevel = useStore().getters[GlobalGetterTypes.USER.getPreferredGasPriceLevel];
  const gasLimit = useStore().getters[GlobalGetterTypes.USER.getGasLimit];

  const inputAmount = calculateInputAmountWithTransactionFees(context, context.inputAmount, gasLimit, gasPriceLevel);

  const payload = {
    chainIn: inputDex.chain,
    denomIn: inputDex.denom,
    denomOut: context.outputCoin.denom,
    amountIn: amountToUnit({ amount: inputAmount, denom: context.inputCoin?.baseDenom }).amount,
    amountOut: amountToUnit({ amount: context.outputAmount, denom: context.outputCoin?.baseDenom }).amount,
  };

  if (direction === 'input') payload.amountOut = null;
  if (direction === 'output') payload.amountIn = null;

  try {
    const { data } = await axios.post(`${endpoint}/daggregation/routing`, payload);
    if (data.routes?.length === 0) throw new Error('No swaps available');

    return data.routes;
  } catch (error) {
    appLogger.reportSingleError(error);
    const cause = error.response?.data?.message ?? error.message;
    if (cause) console.error('[swap]: ' + cause);
    throw error;
  }
};

export const fetchAvailableDenoms = async () => {
  const endpoint = useStore().getters[GlobalGetterTypes.API.getEndpoint];
  const { data } = await axios.get(`${endpoint}/daggregation/available_denoms`, {});

  return data.denoms;
};
