import BigNumber from 'bignumber.js';
import groupBy from 'lodash.groupby';

import { parseCoins } from '@/utils/basic';

export const denomBalancesPerChain = (context: any, denom: string) => {
  const balances = context.balances.filter((item) => item.base_denom === denom);
  return groupBy(balances, 'on_chain');
};

export const totalDenomBalance = (context: any, denom: string, chain?: string) => {
  let balances = context.balances.filter((item) => item.base_denom === denom);

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
