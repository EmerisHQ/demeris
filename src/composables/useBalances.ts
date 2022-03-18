import groupBy from 'lodash.groupby';
import orderBy from 'lodash.orderby';
import { computed } from 'vue';

import useAccount from '@/composables/useAccount';
import { GlobalGetterTypes, RootStoreTyped } from '@/store';
import { parseCoins } from '@/utils/basic';
import getPrice from '@/utils/getPrice';
import { useStore } from '@/utils/useStore';

/**
 * Balance related composable, mostly based off copy pasting code from src/components/assets/AssetsTable/AssetsTable.vue
 * TODO(refactor) : merge the setup contents in AssetTable.vue with this file
 */
export default function useBalances() {
  const { balances: rawBalances } = useAccount();
  const store = useStore() as RootStoreTyped;
  const allBalances = computed(() => {
    let balances = [...rawBalances.value];
    //  remove pools
    balances = balances.filter((balance) => {
      if (balance.base_denom.substring(0, 4) !== 'pool') {
        return balance;
      }
    });
    //  remove assets with 0
    balances = balances.filter((balance) => {
      if (balance.amount.charAt(0) !== '0') {
        return balance;
      }
    });
    return balances;
  });
  const availableByAsset = computed(() => {
    const denomsAggregate = groupBy(allBalances.value, 'base_denom');
    const summary = Object.entries(denomsAggregate).map(([denom, balances = []]) => {
      const totalAmount = balances.reduce((acc, item) => +parseCoins(item.amount)[0].amount + acc, 0);
      const chainsNames = balances.map((item) => item.on_chain);
      const precision = store.getters[GlobalGetterTypes.API.getDenomPrecision]({ name: denom }) ?? 6;
      return {
        denom,
        totalAmount: totalAmount / Math.pow(10, precision),
        chainsNames,
      };
    });
    const sortedSummary = summary.sort((a, b) => (a.totalAmount > b.totalAmount ? -1 : 1));
    return sortedSummary;
  });

  const balancesWithAvailable = computed(() => {
    const balances = availableByAsset.value;

    if (balances.length > 0) {
      balances.map((b) => {
        const value = getPrice({ denom: b.denom, amount: b.totalAmount.toString() });
        (b as any).value = value;
      });
    }
    return balances;
  });

  const orderedUserAvailableBalances = computed(() => {
    return orderBy(
      balancesWithAvailable.value,
      // Consider coin precision to sort by amount, as for CRO it can be high due to its precision
      [(asset) => asset.totalAmount, 'name'],
      ['asc', 'asc'],
    );
  });

  const mostAvailableBalance = computed(() => {
    return balancesWithAvailable.value[0];
  });

  return {
    mostAvailableBalance,
    orderedUserAvailableBalances,
  };
}
