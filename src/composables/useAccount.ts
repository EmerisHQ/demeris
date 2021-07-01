import { computed } from 'vue';
import { useStore } from 'vuex';

export default function useAccount() {
  const store = useStore();

  const balances = computed(() => {
    return store.getters['demeris/getBalances']({ address: store.getters['demeris/getKeplrAddress'] }) || [];
  });

  const balancesByDenom = (denom: string) => {
    return balances.value.filter((item) => item.base_denom === denom);
  };

  return { balances, balancesByDenom };
}
