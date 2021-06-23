import { computed } from 'vue';

import { Pool } from '@/types/actions';

import poolsFixture from '../../tests/fixtures/pools.json';

export default function usePools() {
  const pools = computed<Pool[]>(() => {
    return poolsFixture.pools.map((pool) => ({
      id: +pool.id,
      type_id: pool.type_id,
      reserve_coin_denoms: pool.reserve_coin_denoms,
      reserve_account_address: pool.reserve_account_address,
      pool_coin_denom: pool.pool_coin_denom,
    }));
  });

  const formatPoolName = (pool: Pool) => {
    return pool.reserve_coin_denoms
      .map((item) => item.substr(1))
      .join('/')
      .toUpperCase();
  };

  const poolsByDenom = (denom: string) => {
    return pools.value.filter((item) => item.reserve_coin_denoms.includes(denom));
  };

  const poolById = (id: number) => {
    return pools.value.find((item) => item.id === id);
  };

  return { pools, poolsByDenom, poolById, formatPoolName };
}
