import BigNumber from 'bignumber.js';
import orderBy from 'lodash.orderby';
import { computed, Ref, ref, unref, watch } from 'vue';
import { useStore } from 'vuex';

import { Balances, StakingBalances } from '@/types/api';
import { validBalances } from '@/utils/actionHandler';
import { parseCoins } from '@/utils/basic';

export default function useAccount() {
  const store = useStore();
  const isDemoAccount = computed(() => {
    return store.getters['demerisAPI/isDemoAccount'];
  });
  const allbalances = computed<Balances>(() => {
    // TODO: Remove after cloud is fully deployed
    /*
    if (process.env.NODE_ENV === 'production') {
      return TEST_DATA.balances;
    }
    */
    return store.getters['demerisAPI/getAllBalances'] || [];
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
    const verifiedDenoms = store.getters['demerisAPI/getVerifiedDenoms'];
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
        amount: '' + totalAmount + asset.base_denom,
        displayName: verifiedDenom.display_name,
        precision: store.getters['demerisAPI/getDenomPrecision']({ name: asset.base_denom }) ?? 6,
      });
    }

    return orderBy(
      result,
      [
        // Consider coin precision to sort by amount, as for CRO it can be high due to its precision
        (asset) => +parseCoins(asset.amount)[0].amount / Math.pow(10, asset.precision),
        // Convert 'Gravity 7' to 'Gravity 07', otherwise sorting by string will consider it as 'Gravity 70'
        (asset) => {
          if (asset.base_denom.startsWith('pool')) {
            return asset.displayName.match(/(\d+)/g)[0].padStart(2, 0);
          }
          return asset.displayName;
        },
      ],
      ['desc'],
    );
  };

  const stakingBalances = computed<StakingBalances>(() => {
    return store.getters['demerisAPI/getAllStakingBalances'] || [];
  });

  const stakingBalancesByChain = (chain_name: string) => {
    return stakingBalances.value.filter((item) => {
      if (item) {
        return item.chain_name === chain_name;
      }
    });
  };

  const orderBalancesByPrice = (balances: Balances) => {
    return balances
      .map((item) => {
        const amount = parseCoins(item.amount)[0].amount;
        const denom = item.base_denom;
        const precision = store.getters['demerisAPI/getDenomPrecision']({ name: denom }) ?? 6;
        const price = store.getters['demerisAPI/getPrice']({ denom });
        const result = new BigNumber(amount).multipliedBy(price).shiftedBy(-precision).toNumber();
        return { ...item, price: result };
      })
      .sort((a, b) => b.price - a.price);
  };

  return {
    balances,
    nativeBalances,
    getNativeBalances,
    allbalances,
    balancesByDenom,
    orderBalancesByPrice,
    userAccountBalances,
    redeemableBalances,
    isDemoAccount,
    stakingBalances,
    stakingBalancesByChain,
  };
}
