/* eslint-disable max-lines-per-function */
import BigNumber from 'bignumber.js';
import { computed } from 'vue';
import { useStore } from 'vuex';

import useAccount from '@/composables/useAccount';
import { GlobalGetterTypes, RootStoreTyped } from '@/store';
import { parseCoins } from '@/utils/basic';

export function useTotalPortfolioBalance() {
  const { balances } = useAccount();

  const store = useStore() as RootStoreTyped;
  const { stakingBalances, unbondingDelegations } = useAccount();

  const verifiedDenoms = computed(() => store.getters[GlobalGetterTypes.API.getVerifiedDenoms]);
  const liquidValue = computed(() => {
    if (balances.value.length > 0) {
      return balances.value.reduce((total, balance) => {
        if (balance.verified) {
          if (store.getters[GlobalGetterTypes.API.getPrice]({ denom: balance.base_denom })) {
            const totalValue = new BigNumber(parseCoins(balance.amount)[0].amount).multipliedBy(
              new BigNumber(store.getters[GlobalGetterTypes.API.getPrice]({ denom: balance.base_denom })),
            );
            const precision = Math.pow(
              10,
              store.getters[GlobalGetterTypes.API.getDenomPrecision]({
                name: balance.base_denom,
              }) || 6,
            );
            const totalValueWithPrecision = totalValue.dividedBy(precision);
            return totalValueWithPrecision ? total.plus(totalValueWithPrecision) : total;
          } else {
            return total;
          }
        } else {
          return total;
        }
      }, new BigNumber(0));
    } else {
      return new BigNumber(0);
    }
  });
  const stakedValue = computed(() => {
    return stakingBalances.value.reduce((total, stakingBalance) => {
      const stakedDenom = verifiedDenoms.value.filter((x) => x.chain_name == stakingBalance.chain_name && x.stakable);
      if (stakedDenom.length > 0) {
        if (store.getters[GlobalGetterTypes.API.getPrice]({ denom: stakedDenom[0].name })) {
          const totalValue = new BigNumber(parseCoins(stakingBalance.amount)[0].amount).multipliedBy(
            new BigNumber(store.getters[GlobalGetterTypes.API.getPrice]({ denom: stakedDenom[0].name }) ?? 0),
          );
          const precision = Math.pow(
            10,
            store.getters[GlobalGetterTypes.API.getDenomPrecision]({
              name: stakedDenom[0].name,
            }) || 6,
          );
          const totalValueWithPrecision = totalValue.dividedBy(precision);
          return totalValueWithPrecision ? total.plus(totalValueWithPrecision) : total;
        } else {
          return total;
        }
      } else {
        return total;
      }
    }, new BigNumber(0));
  });
  const unstakingValue = computed(() => {
    return unbondingDelegations.value.reduce((total, unstakingBalance) => {
      const unstakedDenom = verifiedDenoms.value.filter(
        (x) => x.chain_name == unstakingBalance.chain_name && x.stakable,
      );

      if (unstakedDenom.length > 0) {
        let unstakedAmount = new BigNumber(0);
        const unstakedAmounts = unstakingBalance.entries.map((z) => z.balance);
        if (unstakedAmounts.length > 0) {
          unstakedAmount = unstakedAmounts.reduce(
            (acc, item) => acc.plus(new BigNumber(parseInt(item))),
            new BigNumber(0),
          );
        }
        if (store.getters[GlobalGetterTypes.API.getPrice]({ denom: unstakedDenom[0].name })) {
          const totalValue = unstakedAmount.multipliedBy(
            new BigNumber(store.getters[GlobalGetterTypes.API.getPrice]({ denom: unstakedDenom[0].name }) ?? 0),
          );
          const precision = Math.pow(
            10,
            store.getters[GlobalGetterTypes.API.getDenomPrecision]({
              name: unstakedDenom[0].name,
            }) || 6,
          );
          const totalValueWithPrecision = totalValue.dividedBy(precision);
          return totalValueWithPrecision ? total.plus(totalValueWithPrecision) : total;
        } else {
          return total;
        }
      } else {
        return total;
      }
    }, new BigNumber(0));
  });
  const displayPrice = computed(() => {
    const value = liquidValue.value.plus(stakedValue.value).plus(unstakingValue.value);
    return value.isFinite() ? value : new BigNumber(0);
  });

  return displayPrice;
}
