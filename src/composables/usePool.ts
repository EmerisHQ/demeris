import { computed, ComputedRef, unref } from 'vue';

import { useAllStores } from '@/store';

import usePools from './usePools';

export default function usePool(id?: number | ComputedRef<number>) {
  const store = useAllStores();
  const { poolById } = usePools();

  const pool = computed(() => {
    const poolId = unref(id);

    if (!poolId) {
      return;
    }

    return poolById(poolId);
  });

  const totalSupply = computed(() => {
    if (!pool.value) {
      return;
    }

    const supplies = store.getters['cosmos.bank.v1beta1/getTotalSupply']();
    return supplies?.find((token) => token.denom === pool.value.poolCoinDenom)?.amount;
  });

  const reserveBalances = computed(() => {
    if (!pool.value) {
      return;
    }

    return store.getters['demeris/getBalances']({ address: pool.value.reserveAccountAddress });
  });

  const calculateSupplyTokenAmount = (amountA: number, amountB: number) => {
    if (!totalSupply.value || reserveBalances.value) {
      return 1e6;
    }

    const poolCoinAmount = Math.min(
      (totalSupply.value * amountA) / reserveBalances.value[0].amount,
      (totalSupply.value * amountB) / reserveBalances.value[1].amount,
    );

    return poolCoinAmount;
  };

  const calculateWithdrawBalances = (poolCoinAmount: number) => {
    /**
     * TODO: Consider fee proportion
     * WithdrawAmount = ReserveAmount * PoolCoinAmount * WithdrawFeeProportion / TotalSupply
     * @see https://github.com/tendermint/liquidity/blob/develop/x/liquidity/keeper/liquidity_pool.go#L407
     */

    const withdrawCoins = [
      {
        amount: (reserveBalances.value[0].amount * poolCoinAmount) / totalSupply.value,
        denom: reserveBalances.value[0],
      },
      {
        amount: (reserveBalances.value[1].amount * poolCoinAmount) / totalSupply.value,
        denom: reserveBalances.value[1],
      },
    ];

    return withdrawCoins;
  };

  return {
    pool,
    totalSupply,
    reserveBalances,
    calculateSupplyTokenAmount,
    calculateWithdrawBalances,
  };
}
