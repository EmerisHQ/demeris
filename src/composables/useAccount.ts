import { computed } from 'vue';

import { TEST_DATA } from '@/TEST_DATA';

export default function useAccount() {
  // const store = useStore();

  //   const balances = computed(() =>
  //     store.getters['demeris/getBalances']({ address: store.getters['demeris/getKeplrAddress'] }),
  //   );

  const balances = computed(() => TEST_DATA.balances);

  const balancesByDenom = (denom: string) => {
    return balances.value.filter((item) => item.base_denom === denom);
  };

  return { balances, balancesByDenom };
}
