import groupBy from 'lodash.groupby';
import orderBy from 'lodash.orderby';
import { computed } from 'vue';

import useAccount from '@/composables/useAccount';
import { GlobalDemerisGetterTypes } from '@/store';
import { Balances } from '@/types/api';
import { parseCoins } from '@/utils/basic';
import getPrice from '@/utils/getPrice';
import { useStore } from '@/utils/useStore';

/**
 * Balance related composable, mostly based off copy pasting code from src/components/assets/AssetsTable/AssetsTable.vue
 * TODO(refactor) : merge the setup contents in AssetTable.vue with this file
 */
export default function useBalances() {
  const store = useStore();
  const { balances: rawBalances } = useAccount();
  const verifiedDenoms = computed(() => {
    return store.getters[GlobalDemerisGetterTypes.API.getVerifiedDenoms] ?? [];
  });
  const allBalances = computed<Balances>(() => {
    let balances = [
      ...(rawBalances.value as Balances),
      ...verifiedDenoms.value.map((denom) => ({
        base_denom: denom.name,
        on_chain: denom.chain_name,
        amount: '0' + denom.name,
      })),
    ];
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
    return balances as Balances;
  });
  const availableByAsset = computed(() => {
    const denomsAggregate = groupBy(allBalances.value, 'base_denom');
    const summary = Object.entries(denomsAggregate).map(([denom, balances = []]) => {
      const totalAmount = balances.reduce((acc, item) => +parseCoins(item.amount)[0].amount + acc, 0);
      const chainsNames = balances.map((item) => item.on_chain);
      return {
        denom,
        totalAmount,
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
    return orderBy(balancesWithAvailable.value, [(x) => x.totalAmount, 'name'], ['asc', 'asc']);
  });

  const mostAvailableBalance = computed(() => {
    return balancesWithAvailable.value[0];
  });

  return {
    mostAvailableBalance,
    orderedUserAvailableBalances,
  };
}
