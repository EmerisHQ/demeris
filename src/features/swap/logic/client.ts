/* eslint-disable max-lines-per-function */
import { EmerisDEXInfo } from '@emeris/types';
import axios from 'axios';

import { SwapContext } from '../state';
import { amountToUnit } from './amount';

export const fetchDexInfoSwaps = async (): Promise<EmerisDEXInfo.Swaps> => {
  const { data } = await axios.get('https://api.dev.emeris.com/v1/dexinfo/swaps');
  return data.swaps;
};

export const fetchSwapRoutes = async (context: SwapContext, direction?: string) => {
  const inputDex = context.inputCoinDex;

  if (!inputDex) {
    throw new Error('No swaps available');
  }

  const payload = {
    chainIn: inputDex.chain,
    denomIn: inputDex.denom,
    denomOut: context.outputCoin.denom,
    amountIn: amountToUnit({ amount: context.inputAmount, denom: context.inputCoin?.baseDenom }).amount,
    amountOut: amountToUnit({ amount: context.outputAmount, denom: context.outputCoin?.baseDenom }).amount,
  };

  if (direction === 'input') payload.amountOut = null;
  if (direction === 'output') payload.amountIn = null;

  const { data } = await axios.post('https://api.dev.emeris.com/v1/daggregation/routing', payload);
  if (data.routes?.length === 0) {
    throw new Error('No swaps available');
  }
  return data.routes;
};

export const fetchAvailableDenoms = async () => {
  const { data } = await axios.get('https://api.dev.emeris.com/v1/daggregation/available_denoms', {});

  return data.denoms;
};
