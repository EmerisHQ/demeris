/* eslint-disable max-lines-per-function */
import { EmerisAPI } from '@emeris/types';
import BigNumber from 'bignumber.js';
import orderBy from 'lodash.orderby';
import { computed, Ref, ref, unref, watch } from 'vue';

import { GlobalGetterTypes, RootStoreTyped } from '@/store';
import { validBalances } from '@/utils/actionHandler';
import { parseCoins } from '@/utils/basic';
import { sortBalancesByAmount } from '@/utils/sorting';
import { useStore } from '@/utils/useStore';

let useAccountsInstance = null;
export function useAccount() {
  const store = useStore() as RootStoreTyped;
  const isDemoAccount = computed(() => {
    return store.getters[GlobalGetterTypes.USER.isDemoAccount];
  });
  const allbalances = computed(() => {
    return store.getters[GlobalGetterTypes.API.getAllBalances] || ([] as EmerisAPI.Balances);
  });

  const redeemableBalances = ref([]);
  const balances = ref(allbalances.value);
  const isValidatingBalances = ref(false);
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
      isValidatingBalances.value = true;
      const result = await validBalances(newBalances);
      balances.value = sortBalancesByAmount(result);
      isValidatingBalances.value = false;
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

  const allLoaded = computed(() => {
    return !store.getters[GlobalGetterTypes.USER.getFirstLoad];
  });

  const nativeBalances = computed(() => getNativeBalances({ balances, aggregate: true }));

  const getNativeBalances = (
    { balances, aggregate }: { balances?: EmerisAPI.Balances | Ref<EmerisAPI.Balances>; aggregate?: boolean } = {
      balances: [],
    },
  ) => {
    const verifiedDenoms = store.getters[GlobalGetterTypes.API.getVerifiedDenoms];
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
        precision: store.getters[GlobalGetterTypes.API.getDenomPrecision]({ name: asset.base_denom }) ?? 6,
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

  /* Account Balances that could enter the stake process */
  const stakableBalances = computed(() => getStakableBalances({ balances }));

  const getStakableBalances = (
    { balances }: { balances?: EmerisAPI.Balances | Ref<EmerisAPI.Balances> } = {
      balances: [],
    },
  ) => {
    const verifiedDenoms = store.getters[GlobalGetterTypes.API.getVerifiedDenoms];

    return unref(balances).filter(
      (balance) => verifiedDenoms.find((denom) => denom.name == balance.base_denom)?.stakable,
    );
  };

  const stakingBalances = computed(() => {
    return store.getters[GlobalGetterTypes.API.getAllStakingBalances] || [];
  });

  const stakingBalancesByChain = (chain_name: string) => {
    return stakingBalances.value.filter((item) => {
      if (item) {
        return item.chain_name === chain_name;
      }
    });
  };

  const stakingAmountByChain = (chain_name: string) => {
    let stakedAmount = new BigNumber(0);
    const stakedAmounts = stakingBalancesByChain(chain_name);
    let totalStakedAmount = new BigNumber(0);
    if (stakedAmounts.length > 0) {
      stakedAmount = stakedAmounts.reduce((acc, item) => acc.plus(new BigNumber(item.amount)), new BigNumber(0));
      totalStakedAmount = totalStakedAmount.plus(stakedAmount);
    }
    return totalStakedAmount;
  };

  const unbondingDelegations = computed(() => {
    return store.getters[GlobalGetterTypes.API.getAllUnbondingDelegations] || [];
  });
  const unbondingDelegationsByChain = (chain_name: string) => {
    return unbondingDelegations.value.filter((item) => {
      if (item) {
        return item.chain_name === chain_name;
      }
    });
  };

  const orderBalancesByPrice = (balances: EmerisAPI.Balances) => {
    return balances
      .map((item) => {
        const amount = parseCoins(item.amount)[0].amount;
        const denom = item.base_denom;
        const precision = store.getters[GlobalGetterTypes.API.getDenomPrecision]({ name: denom }) ?? 6;
        const price = store.getters[GlobalGetterTypes.API.getPrice]({ denom });
        const result = new BigNumber(amount).multipliedBy(price).shiftedBy(-precision).toNumber();
        return { ...item, price: result };
      })
      .sort((a, b) => b.price - a.price);
  };
  return {
    balances,
    nativeBalances,
    getNativeBalances,
    stakableBalances,
    getStakableBalances,
    allbalances,
    balancesByDenom,
    orderBalancesByPrice,
    userAccountBalances,
    redeemableBalances,
    isDemoAccount,
    stakingBalances,
    stakingBalancesByChain,
    allLoaded,
    stakingAmountByChain,
    unbondingDelegations,
    unbondingDelegationsByChain,
    isValidatingBalances,
  };
}

export default function useAccountFactory() {
  if (!useAccountsInstance) {
    useAccountsInstance = useAccount();
  }
  return useAccountsInstance;
}
