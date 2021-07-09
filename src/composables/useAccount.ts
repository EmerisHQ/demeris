import { computed, ref, watch } from 'vue';
import { useStore } from 'vuex';

import { Balances } from '@/types/api';
import { toRedeem, validBalances } from '@/utils/actionHandler';

export default function useAccount() {
  const store = useStore();

  const allbalances = computed<Balances>(() => {
    // TODO: Remove after cloud is fully deployed
    /*
    if (process.env.NODE_ENV === 'production') {
      return TEST_DATA.balances;
    }
    */
    return store.getters['demeris/getAllBalances'] || [];
  });

  const redeemableBalances = ref([]);
  const balances = ref(allbalances.value);
  watch(
    () => allbalances.value,
    async (newBalances) => {
      redeemableBalances.value = await toRedeem(newBalances);
    },
  );
  watch(
    () => allbalances.value,
    async (newBalances) => {
      balances.value = await validBalances(newBalances);
    },
  );
  const balancesByDenom = (denom: string) => {
    return balances.value.filter((item) => item.base_denom === denom);
  };

  const userAccountBalances = computed(() => {
    const sortedBalances = {
      verified: [],
      unverified: [],
    };

    balances?.value?.forEach((coin) => {
      if (coin.verified) {
        sortedBalances.verified.push(coin);
      } else {
        sortedBalances.unverified.push(coin);
      }
    });

    return sortedBalances;
  });

  return { balances, allbalances, balancesByDenom, userAccountBalances, redeemableBalances };
}
