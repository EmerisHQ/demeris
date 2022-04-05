import { EmerisDEXInfo } from '@emeris/types';
import { AbstractAmount } from '@emeris/types/lib/EmerisTransactions';

import { GlobalGetterTypes, RootStoreTyped } from '@/store';
import { ActionStepResult } from '@/types/actions';
import { useStore } from '@/utils/useStore';

export async function withdrawLiquidity({ pool_id, poolCoin }: { pool_id: bigint; poolCoin: AbstractAmount }) {
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
  const pool = liquidityPools.pools.find((x) => x.pool_coin_denom == poolCoin.denom) ?? null;
  if (pool && pool.id == pool_id) {
    result.steps.push({
      type: 'withdrawLiquidity',
      status: 'pending',
      protocol: EmerisDEXInfo.DEX.Gravity,
      data: {
        poolCoin,
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
