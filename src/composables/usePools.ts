import { computed } from 'vue';

import { Pool } from '@/types/actions';
import { getDisplayName } from '@/utils/actionHandler';

import { store, useAllStores } from '../store/index';

export default function usePools() {
  const stores = useAllStores();
  const pools = computed(() => {
    return stores.getters['tendermint.liquidity.v1beta1/getLiquidityPools']().pools || [];
  });

  const formatPoolName = async (pool: Pool) => {
    return (
      await Promise.all(
        pool.reserve_coin_denoms.map(async (item) => await getDisplayName(item, store.getters['demeris/getDexChain'])),
      )
    )
      .join('/')
      .toUpperCase();
  };

  const poolsByDenom = (denom: string) => {
    return pools.value.filter((item) => item.reserve_coin_denoms.includes(denom));
  };

  const poolById = (id: string) => {
    return pools.value.find((item) => item.id === id);
  };

  return { pools, poolsByDenom, poolById, formatPoolName };
}
