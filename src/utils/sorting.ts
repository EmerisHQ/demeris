import { EmerisAPI } from '@emeris/types';
import BigNumber from 'bignumber.js';

import { GlobalGetterTypes, RootStoreTyped } from '@/store';
import { getDisplayAmount, parseCoins } from '@/utils/basic';
import { useStore } from '@/utils/useStore';

export function sortBalancesByAmount(balances: EmerisAPI.Balances) {
  const typedStore = useStore() as RootStoreTyped;

  return balances.sort((a, b) => {
    const precisionA = typedStore.getters[GlobalGetterTypes.API.getDenomPrecision]({
      name: a.base_denom,
    });
    const precisionB = typedStore.getters[GlobalGetterTypes.API.getDenomPrecision]({
      name: b.base_denom,
    });
    const amountA = getDisplayAmount(parseCoins(a.amount)[0].amount, precisionA);
    const amountB = getDisplayAmount(parseCoins(b.amount)[0].amount, precisionB);
    return new BigNumber(amountB).minus(amountA);
  });
}
