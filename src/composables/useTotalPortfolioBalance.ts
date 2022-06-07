import { EmerisAPI } from '@emeris/types';
/* eslint-disable max-lines-per-function */
import { computed } from 'vue';
import { useStore } from 'vuex';

import { GlobalGetterTypes, RootStoreTyped } from '@/store';

export function useTotalPortfolioBalance() {
  const store = useStore() as RootStoreTyped;
  const balances = computed(() => store.getters[GlobalGetterTypes.API.getAllBalances] || ([] as EmerisAPI.Balances));
  const stakingBalances = computed(() => store.getters[GlobalGetterTypes.API.getAllStakingBalances] || []);
  const unbondingDelegations = computed(() => store.getters[GlobalGetterTypes.API.getAllUnbondingDelegations] || []);

  const verifiedDenoms = computed(() => store.getters[GlobalGetterTypes.API.getVerifiedDenoms]);
  const liquidValue = computed(() => {
    if (balances.value.length > 0) {
      return balances.value.reduce((total, balance) => {
        if (balance.verified) {
          if (store.getters[GlobalGetterTypes.API.getPrice]({ denom: balance.base_denom })) {
            const totalValue =
              parseInt(balance.amount) * store.getters[GlobalGetterTypes.API.getPrice]({ denom: balance.base_denom });
            const precision = Math.pow(
              10,
              store.getters[GlobalGetterTypes.API.getDenomPrecision]({
                name: balance.base_denom,
              }) || 6,
            );
            const value = totalValue / precision;
            if (value) {
              return total + value;
            } else {
              return total;
            }
          } else {
            return total;
          }
        } else {
          return total;
        }
      }, 0);
    } else {
      return 0;
    }
  });
  const stakedValue = computed(() => {
    return stakingBalances.value.reduce((total, stakingBalance) => {
      const stakedDenom = verifiedDenoms.value.filter((x) => x.chain_name == stakingBalance.chain_name && x.stakable);
      if (stakedDenom.length > 0) {
        if (store.getters[GlobalGetterTypes.API.getPrice]({ denom: stakedDenom[0].name })) {
          const totalValue =
            parseInt(stakingBalance.amount) *
              store.getters[GlobalGetterTypes.API.getPrice]({ denom: stakedDenom[0].name }) ?? 0;
          const precision = Math.pow(
            10,
            store.getters[GlobalGetterTypes.API.getDenomPrecision]({
              name: stakedDenom[0].name,
            }) || 6,
          );
          const value = totalValue / precision;
          if (value) {
            return total + value;
          } else {
            return total;
          }
        } else {
          return total;
        }
      } else {
        return total;
      }
    }, 0);
  });
  const unstakingValue = computed(() => {
    return unbondingDelegations.value.reduce((total, unstakingBalance) => {
      const unstakedDenom = verifiedDenoms.value.filter(
        (x) => x.chain_name == unstakingBalance.chain_name && x.stakable,
      );

      if (unstakedDenom.length > 0) {
        let unstakedAmount;
        const unstakedAmounts = unstakingBalance.entries.map((z) => z.balance);
        if (unstakedAmounts.length > 0) {
          unstakedAmount = unstakedAmounts.reduce((acc, item) => +parseInt(item) + acc, 0);
        }
        if (store.getters[GlobalGetterTypes.API.getPrice]({ denom: unstakedDenom[0].name })) {
          const totalValue =
            parseInt(unstakedAmount) *
              store.getters[GlobalGetterTypes.API.getPrice]({ denom: unstakedDenom[0].name }) ?? 0;
          const precision = Math.pow(
            10,
            store.getters[GlobalGetterTypes.API.getDenomPrecision]({
              name: unstakedDenom[0].name,
            }) || 6,
          );
          const value = totalValue / precision;
          if (value) {
            return total + value;
          } else {
            return total;
          }
        } else {
          return total;
        }
      } else {
        return total;
      }
    }, 0);
  });
  const displayPrice = computed(() => {
    const value = liquidValue.value + stakedValue.value + unstakingValue.value;
    return Number.isFinite(value) ? value : 0;
  });

  return displayPrice;
}
