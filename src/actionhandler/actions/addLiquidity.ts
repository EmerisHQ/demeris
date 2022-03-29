import { AbstractAmount } from '@emeris/types/lib/EmerisTransactions';

import { GlobalGetterTypes, RootStoreTyped } from '@/store';
import { ActionStepResult } from '@/types/actions';
import { useStore } from '@/utils/useStore';

export async function addLiquidity({
  pool_id,
  coinA,
  coinB,
}: {
  pool_id: bigint;
  coinA: AbstractAmount;
  coinB: AbstractAmount;
}) {
  const store = useStore();
  const typedstore = store as RootStoreTyped;
  const result: ActionStepResult = {
    steps: [],
    output: {
      denom: '',
      amount: '0',
      chain_name: '',
    },
  };
  const liquidityPools =
    store.getters['tendermint.liquidity.v1beta1/getLiquidityPools']() ??
    (await store.dispatch(
      'tendermint.liquidity.v1beta1/QueryLiquidityPools',
      { options: { subscribe: false, all: true }, params: {} },
      { root: true },
    ));
  // Find the pool for that pair by base denoms
  const pool = liquidityPools.pools.find((item) => item.id == pool_id);
  if (pool) {
    result.steps.push({
      type: 'addLiquidity',
      status: 'pending',
      data: {
        coinA,
        coinB,
        pool,
        chainName: typedstore.getters[GlobalGetterTypes.API.getDexChain],
      },
    });
    return result;
  } else {
    //Pool does not exist, throw error for MVP. In the future implement as multiple swaps
    throw new Error('Pool does not exist');
  }
}
