import { computed, ComputedRef, ref, unref, watch } from 'vue';

import { useAllStores } from '@/store';

import usePools from './usePools';

export default function usePool(id?: string | ComputedRef<string>) {
  const store = useAllStores();
  const { poolById, formatPoolName } = usePools();

  const pool = computed(() => {
    const poolId = unref(id);

    if (!poolId) {
      return;
    }

    return poolById(poolId);
  });

  const pairName = ref('-/-');

  const setPairName = async () => {
    if (!pool.value) {
      return;
    }

    pairName.value = await formatPoolName(pool.value);
  };

  const totalSupply = computed(() => {
    if (!pool.value) {
      return;
    }

    const supplies = store.getters['cosmos.bank.v1beta1/getTotalSupply']();
    return supplies?.supply.find((token) => token.denom === pool.value.pool_coin_denom)?.amount;
  });

  const reserveBalances = computed(() => {
    if (!pool.value) {
      return;
    }

    return (
      store.getters['cosmos.bank.v1beta1/getAllBalances']({ params: { address: pool.value.reserve_account_address } })
        ?.balances || []
    );
  });

  const updateReserveBalances = async () => {
    if (!pool.value) {
      return;
    }

    await store.dispatch('cosmos.bank.v1beta1/QueryAllBalances', {
      params: { address: pool.value.reserve_account_address },
    });
  };

  const calculateSupplyTokenAmount = (amountA: number, amountB: number) => {
    if (!totalSupply.value || !reserveBalances.value) {
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
        denom: reserveBalances.value[0].denom,
      },
      {
        amount: (reserveBalances.value[1].amount * poolCoinAmount) / totalSupply.value,
        denom: reserveBalances.value[1].denom,
      },
    ];

    return withdrawCoins;
  };

  watch(
    pool,
    () => {
      updateReserveBalances();
      setPairName();
    },
    { immediate: true },
  );

  return {
    pool,
    pairName,
    totalSupply,
    reserveBalances,
    updateReserveBalances,
    calculateSupplyTokenAmount,
    calculateWithdrawBalances,
  };
}
