import { computed } from 'vue';
import { useStore } from 'vuex';

export default function useAccount() {
  const store = useStore();

  const balances = computed(() => {
    // TODO: Remove after cloud is fully deployed
    /*
    if (process.env.NODE_ENV === 'production') {
      return TEST_DATA.balances;
    }
    */
    return store.getters['demeris/getAllBalances'] || [];
  });

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

  return { balances, balancesByDenom, userAccountBalances };
}
