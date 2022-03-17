import { BigNumber } from 'bignumber.js';
import { computed, ComputedRef, ref, unref, watch } from 'vue';

import { GlobalGetterTypes, RootStoreTyped } from '@/store';
import { getBaseDenomSync } from '@/utils/actionHandler';
import { keyHashfromAddress, parseCoins } from '@/utils/basic';
import { useStore } from '@/utils/useStore';

import usePools from './usePools';

const usePoolInstances = {};

function usePool(id: string) {
  const store = useStore();
  const typedstore = store as RootStoreTyped;
  let initialized;
  const initPromise = new Promise((resolve) => {
    initialized = resolve;
  });
  const {
    getPoolById,
    getPoolName,
    getPoolPrice,
    getReserveBaseDenoms,
    getWithdrawBalances,
    getIsReversePairName,
    initPromise: poolInit,
  } = usePools();
  const pool = computed(() => getPoolById(unref(id)));
  const reserveBaseDenoms = ref([]);
  const pairName = ref('-/-');
  const isReversePairName = ref(false);

  const totalLiquidityPrice = ref(0);

  const poolPrice = async () => {
    return await getPoolPrice(unref(pool));
  };
  const init = async () => {
    await poolInit;
    pairName.value = await getPoolName(pool.value);
    isReversePairName.value = await getIsReversePairName(pool.value, pairName.value);
    reserveBaseDenoms.value = await getReserveBaseDenoms(pool.value);

    watch(
      () => typedstore.getters[GlobalGetterTypes.API.getPrice]({ denom: reserveBaseDenoms.value[0] }),
      updateTotalLiquidityPrice,
      {
        immediate: true,
      },
    );
    watch(
      () => typedstore.getters[GlobalGetterTypes.API.getPrice]({ denom: reserveBaseDenoms.value[1] }),
      updateTotalLiquidityPrice,
      {
        immediate: true,
      },
    );
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
      typedstore.getters[GlobalGetterTypes.API.getBalances]({
        address: keyHashfromAddress(pool.value?.reserve_account_address),
      }) || []
    ).map((item) => {
      return { ...parseCoins(item.amount)[0], base_denom: item.base_denom };
    });
  });

  const calculateSupplyTokenAmount = (amounts: { denom: string; amount: number }[]) => {
    if (!totalSupply.value || !reserveBalances.value) {
      return 1;
    }

    const sortedBalances = [...reserveBalances.value].sort((a, b) => (b.base_denom > a.base_denom ? -1 : 1));
    const amountA = amounts.find((item) => getBaseDenomSync(item.denom) === sortedBalances[0].base_denom).amount;
    const amountB = amounts.find((item) => getBaseDenomSync(item.denom) === sortedBalances[1].base_denom).amount;

    const poolCoinAmount = Math.min(
      (totalSupply.value * amountA) / parseInt(sortedBalances[0].amount),
      (totalSupply.value * amountB) / parseInt(sortedBalances[1].amount),
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
      const price = typedstore.getters[GlobalGetterTypes.API.getPrice]({ denom });

      const precision = typedstore.getters[GlobalGetterTypes.API.getDenomPrecision]({ name: denom }) || 6;
      const balance = reserveBalances.value.find((b) => {
        return b.base_denom === denom;
      });
      const amount = balance?.amount;
      if (price && amount) {
        const liquidityPrice = new BigNumber(amount).dividedBy(Math.pow(10, precision)).multipliedBy(price).toNumber();
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
    isReversePairName,
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
export default function usePoolFactory(id: string | ComputedRef<string>) {
  const realId = unref(id);
  if (!usePoolInstances[realId]) {
    usePoolInstances[realId] = usePool(realId);
  }
  return usePoolInstances[realId];
}
