import { computed } from 'vue';

import { Pool } from '@/types/actions';

import poolsFixture from '../../tests/fixtures/pools.json';

export default function usePools() {
  const pools = computed<Pool[]>(() => {
    return poolsFixture.pools.map((pool) => ({
      id: +pool.id,
      typeId: pool.type_id,
      reserveCoinDenoms: pool.reserve_coin_denoms,
      reserveAccountAddress: pool.reserve_account_address,
      poolCoinDenom: pool.pool_coin_denom,
    }));
  });

  const formatPoolName = (pool: Pool) => {
    return pool.reserveCoinDenoms.join('/').toUpperCase();
  };

  const poolsByDenom = (denom: string) => {
    return pools.value.filter((item) => item.reserveCoinDenoms.includes(denom));
  };

  return { pools, poolsByDenom, formatPoolName };
}
