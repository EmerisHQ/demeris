import { EmerisBase } from '@emeris/types';
import BigNumber from 'bignumber.js';

import { GlobalGetterTypes } from '@/store';
import { getBaseDenomSync } from '@/utils/actionHandler';
import { parseCoins } from '@/utils/basic';
import { useStore } from '@/utils/useStore';

import { SwapContext } from '../state/machine';

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
  const precision = useStore().getters[GlobalGetterTypes.API.getDenomPrecision]({ name: getBaseDenomSync(denom) }) ?? 6;
  return {
    amount: new BigNumber(amount).shiftedBy(-precision).decimalPlaces(precision).toString(),
    denom,
  };
};

export const amountToUnit = ({ amount, denom }: EmerisBase.Amount) => {
  const precision = useStore().getters[GlobalGetterTypes.API.getDenomPrecision]({ name: getBaseDenomSync(denom) }) ?? 6;
  const amountBN = new BigNumber(amount);

  const value = amountBN.isPositive() ? new BigNumber(amount).shiftedBy(precision) : 0;

  return {
    amount: value.toString(),
    denom,
  };
};

export const getOrderPrice = (input: string, output: string) => {
  return new BigNumber(output).dividedBy(input).toString();
};

export const getOrderPriceFromContext = (context: SwapContext) => {
  return getOrderPrice(context.inputAmount, context.outputAmount);
};

export const calculateSlippage = (amount: string, maxSlippage: number, factor = 1) => {
  const value = new BigNumber(amount);
  const slippage = 1 - maxSlippage / 100;
  return value.times(Math.pow(slippage, factor)).toFixed();
};
