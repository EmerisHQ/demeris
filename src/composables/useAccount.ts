import { computed } from 'vue';
import { useStore } from 'vuex';

//import { TEST_DATA } from '@/TEST_DATA';

export default function useAccount() {
  const store = useStore();

  const signedAddress = computed(() => {
    return store.getters['demeris/getKeplrAddress'];
  });

  const balances = computed(() => {
    // TODO: Remove after cloud is fully deployed
    /*
    if (process.env.NODE_ENV === 'production') {
      return TEST_DATA.balances;
    }
    */
    return store.getters['demeris/getBalances']({ address: signedAddress.value }) || [];
  });

  const balancesByDenom = (denom: string) => {
    return balances.value.filter((item) => item.base_denom === denom);
  };

  return { signedAddress, balances, balancesByDenom };
}
