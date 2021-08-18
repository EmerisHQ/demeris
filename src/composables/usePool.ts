import { computed, ComputedRef, ref, unref, watch } from 'vue';

import { useAllStores } from '@/store';
import { keyHashfromAddress, parseCoins } from '@/utils/basic';

import usePools from './usePools';

export default function usePool(id?: string | ComputedRef<string>) {
  const store = useAllStores();
  let initialized;
  const initPromise = new Promise((resolve) => {
    initialized = resolve;
  });
  const { getPoolById, getPoolName, getPoolPrice, getReserveBaseDenoms, getWithdrawBalances } = usePools();
  const pool = computed(() => getPoolById(unref(id)));
  const reserveBaseDenoms = ref([]);
  const pairName = ref('-/-');

  const totalLiquidityPrice = ref(0);

  const poolPrice = async () => {
    return await getPoolPrice(unref(pool));
  };
  const init = async () => {
    pairName.value = await getPoolName(pool.value);
    reserveBaseDenoms.value = await getReserveBaseDenoms(pool.value);
  };

  const totalSupply = computed(() => {
    const supplies = store.getters['cosmos.bank.v1beta1/getTotalSupply']();
    return supplies?.supply.find((token) => token.denom === pool.value.pool_coin_denom)?.amount;
  });

  const reserveBalances = computed(() => {
    if (!pool.value) {
      return [];
    }
    return (
      store.getters['demeris/getBalances']({ address: keyHashfromAddress(pool.value?.reserve_account_address) }) || []
    ).map((item) => {
      return { ...parseCoins(item.amount)[0], base_denom: item.base_denom };
    });
  });

  const calculateSupplyTokenAmount = (amountA: number, amountB: number) => {
    if (!totalSupply.value || !reserveBalances.value) {
      return 1;
    }

    const sortedBalances = [...reserveBalances.value].sort((a, b) => (b.base_denom > a.base_denom ? -1 : 1));

    const poolCoinAmount = Math.min(
      (totalSupply.value * amountA) / sortedBalances[0].amount,
      (totalSupply.value * amountB) / sortedBalances[1].amount,
    );

    return poolCoinAmount;
  };

  const updateTotalLiquidityPrice = async () => {
    if (!pool.value) {
      return;
    }

    const baseDenoms = await getReserveBaseDenoms(pool.value);
    const prices = [];

    baseDenoms.map((denom) => {
      const price = store.getters['demeris/getPrice']({ denom });
      const precision = store.getters['demeris/getDenomPrecision']({ name: denom }) || 6;
      const balance = reserveBalances.value.find((b) => {
        return b.base_denom === denom;
      });
      const amount = balance?.amount;
      if (price && amount) {
        const liquidityPrice = (amount / Math.pow(10, precision)) * price;
        prices.push(liquidityPrice);
      }
    });
    if (prices[0] === 0 || prices[1] === 0) {
      totalLiquidityPrice.value = 0;
    } else {
      totalLiquidityPrice.value = prices[0] + prices[1];
    }
  };
  const getPoolWithdrawBalances = (poolCoinAmount: number) => {
    return getWithdrawBalances(pool.value, poolCoinAmount);
  };

  watch(
    pool,
    async () => {
      await init();
      initialized();
    },
    { immediate: true },
  );

  watch(reserveBalances, updateTotalLiquidityPrice, { immediate: true });

  return {
    pool,
    pairName,
    totalSupply,
    reserveBalances,
    reserveBaseDenoms,
    poolPrice,
    calculateSupplyTokenAmount,
    getPoolWithdrawBalances,
    totalLiquidityPrice,
    initPromise,
  };
}
