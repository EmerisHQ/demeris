import { EmerisBase } from '@emeris/types';

import { RootStoreTyped } from '@/store';
import { useStore } from '@/utils/useStore';

export async function addLiquidity({
  pool_id,
  coinA,
  coinB,
}: {
  pool_id: bigint;
  coinA: EmerisBase.Amount;
  coinB: EmerisBase.Amount;
}) {
  const libStore = useStore();
  const store = libStore as RootStoreTyped;
  const result = {
    steps: [],
    output: {
      denom: '',
      amount: 0,
      chain_name: '',
    },
  };
  const liquidityPools =
    store.getters['tendermint.liquidity.v1beta1/getLiquidityPools']() ??
    (await libStore.dispatch(
      'tendermint.liquidity.v1beta1/QueryLiquidityPools',
      { options: { subscribe: false, all: true }, params: {} },
      { root: true },
    ));
  // Find the pool for that pair by base denoms
  const pool = liquidityPools.pools.find((item) => item.id == pool_id);
  if (pool) {
    result.steps.push({
      name: 'addliquidity',
      status: 'pending',
      data: {
        coinA,
        coinB,
        pool,
      },
    });
    return result;
  } else {
    //Pool does not exist, throw error for MVP. In the future implement as multiple swaps
    throw new Error('Pool does not exist');
  }
}
