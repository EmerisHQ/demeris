import BigNumber from 'bignumber.js';
import { computed, ComputedRef, ref, unref, watch } from 'vue';

import { useAllStores } from '@/store';
import { GlobalDemerisActionTypes } from '@/store/demeris/action-types';
import { keyHashfromAddress, parseCoins } from '@/utils/basic';

import usePools from './usePools';

export default function usePool(id?: string | ComputedRef<string>) {
  const store = useAllStores();
  const reserveBaseDenoms = ref([]);

  const { poolById, formatPoolName, poolPriceById, getReserveBaseDenoms } = usePools();

  const pool = computed(() => {
    const poolId = unref(id);

    if (!poolId) {
      return;
    }

    return poolById(poolId);
  });
  const poolPrice = async () => {
    return await poolPriceById(unref(id));
  };
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

    const hashAddress = keyHashfromAddress(pool.value.reserve_account_address);

    const result = store.getters['demeris/getBalances']({ address: hashAddress }) || [];

    return result.map((item) => parseCoins(item.amount)[0]);
  });

  const updateReserveBalances = async () => {
    if (!pool.value) {
      return;
    }

    reserveBaseDenoms.value = await getReserveBaseDenoms(pool.value);
    const hashAddress = keyHashfromAddress(pool.value.reserve_account_address);

    await store.dispatch(GlobalDemerisActionTypes.GET_BALANCES, {
      params: { address: hashAddress },
    });
  };

  const calculateSupplyTokenAmount = (amountA: number, amountB: number) => {
    if (!totalSupply.value || !reserveBalances.value) {
      return 1;
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

    const hasParams = totalSupply.value && reserveBalances.value;

    const withdrawCoins = [
      {
        amount: !hasParams
          ? 0
          : new BigNumber(poolCoinAmount)
              .multipliedBy(reserveBalances.value[0].amount)
              .dividedBy(totalSupply.value)
              .decimalPlaces(6)
              .toNumber(),
        denom: reserveBalances.value[0].denom,
      },
      {
        amount: !hasParams
          ? 0
          : new BigNumber(poolCoinAmount)
              .multipliedBy(reserveBalances.value[1].amount)
              .dividedBy(totalSupply.value)
              .decimalPlaces(6)
              .toNumber(),
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
    reserveBaseDenoms,
    poolPrice,
    updateReserveBalances,
    calculateSupplyTokenAmount,
    calculateWithdrawBalances,
  };
}
