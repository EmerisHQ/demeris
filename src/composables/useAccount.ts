import { computed } from 'vue';
import { useStore } from 'vuex';

//import { TEST_DATA } from '@/TEST_DATA';

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

  return { balances, balancesByDenom };
}
