import { computed, Ref, ref, unref, watch } from 'vue';
import { useStore } from 'vuex';

import { Balances, StakingBalances } from '@/types/api';
import { toRedeem, validBalances } from '@/utils/actionHandler';
import { parseCoins } from '@/utils/basic';

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
  /*
  watch(
    () => allbalances.value,
    async (newBalances, oldBalances) => {
      if (JSON.stringify(newBalances) != JSON.stringify(oldBalances)) {
        redeemableBalances.value = await toRedeem(newBalances);
      }
    },
    { immediate: true },
  );
  */
  watch(
    () => allbalances.value,
    async (newBalances) => {
      const result = await validBalances(newBalances);
      balances.value = result.sort((a, b) => {
        const coinA = parseCoins(a.amount)[0];
        const coinB = parseCoins(b.amount)[0];
        return +coinB.amount - +coinA.amount;
      });
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

  const nativeBalances = computed(() => getNativeBalances({ balances, aggregate: true }));

  const getNativeBalances = (
    { balances, aggregate }: { balances?: Balances | Ref<Balances>; aggregate?: boolean } = { balances: [] },
  ) => {
    const verifiedDenoms = store.getters['demeris/getVerifiedDenoms'];
    const result = [];

    for (const verifiedDenom of verifiedDenoms) {
      let asset = {
        denom: verifiedDenom.name,
        base_denom: verifiedDenom.name,
        on_chain: verifiedDenom.chain_name,
      };

      let totalAmount = 0;
      if (aggregate) {
        const availableBalances = unref(balances).filter((balance) => balance.base_denom === verifiedDenom.name);

        for (const balance of availableBalances) {
          totalAmount += +parseCoins(balance.amount)[0].amount;
          // Native chain
          if (balance.on_chain === verifiedDenom.chain_name) {
            // @ts-ignore
            asset = balance;
          }
        }
      }

      result.push({
        ...asset,
        amount: '' + totalAmount + asset.denom,
        displayName: verifiedDenom.display_name,
      });
    }

    result.sort((a, b) => {
      const coinA = parseCoins(a.amount)[0];
      const coinB = parseCoins(b.amount)[0];
      return +coinB.amount - +coinA.amount || a.displayName.localeCompare(b.displayName);
    });

    return result;
  };

  const stakingBalances = computed<StakingBalances>(() => {
    return store.getters['demeris/getAllStakingBalances'] || [];
  });

  const stakingBalancesByChain = (chain_name: string) => {
    return stakingBalances.value.filter((item) => {
      if (item) {
        return item.chain_name === chain_name;
      }
    });
  };

  return {
    balances,
    nativeBalances,
    getNativeBalances,
    allbalances,
    balancesByDenom,
    userAccountBalances,
    redeemableBalances,
    isDemoAccount,
    stakingBalances,
    stakingBalancesByChain,
  };
}
