import { computed, ref, watch } from 'vue';
import { useStore } from 'vuex';

import { Balances, StakingBalances } from '@/types/api';
import { toRedeem, validBalances } from '@/utils/actionHandler';

export default function useAccount() {
  const store = useStore();
  const isDemoAccount = computed(() => {
    return store.getters['demeris/isDemoAccount'];
  });
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
    async (newBalances, oldBalances) => {
      if (JSON.stringify(newBalances) != JSON.stringify(oldBalances)) {
        redeemableBalances.value = await toRedeem(newBalances);
      }
    },
    { immediate: true },
  );
  watch(
    () => allbalances.value,
    async (newBalances) => {
      balances.value = await validBalances(newBalances);
    },
    { immediate: true },
  );
  const balancesByDenom = (denom: string) => {
    return balances.value.filter((item) => item.base_denom === denom);
  };

  const userAccountBalances = computed(() => {
    const sortedBalances = {
      verified: [],
      unverified: [],
    };

    JSON.parse(JSON.stringify(balances.value)).forEach((coin) => {
      if (coin.verified) {
        sortedBalances.verified.push(coin);
      } else {
        sortedBalances.unverified.push(coin);
      }
    });

    return sortedBalances;
  });

  const stakingBalances = computed<StakingBalances>(() => {
    return store.getters['demeris/getAllStakingBalances'] || [];
  });

  const stakingBalancesByChain = (chain_name: string) => {
    return stakingBalances.value.filter((item) => item.chain_name === chain_name);
  };

  return {
    balances,
    allbalances,
    balancesByDenom,
    userAccountBalances,
    redeemableBalances,
    isDemoAccount,
    stakingBalances,
    stakingBalancesByChain,
  };
}
