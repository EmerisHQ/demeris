import { computed } from 'vue';
import { useStore } from 'vuex';

import { Balances } from '@/types/api';

export default function useAccount() {
  const store = useStore();

  const balances = computed<Balances>(() => {
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
