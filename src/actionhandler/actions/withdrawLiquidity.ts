import { Amount } from '@/types/base';
import { useStore } from '@/utils/useStore';

export async function withdrawLiquidity({ pool_id, poolCoin }: { pool_id: bigint; poolCoin: Amount }) {
  const libStore = useStore();
  const result = {
    steps: [],
    output: {
      amount: {
        denom: '',
        amount: 0,
      },
      chain_name: '',
    },
  };
  const liquidityPools =
    libStore.getters['tendermint.liquidity.v1beta1/getLiquidityPools']() ??
    (await libStore.dispatch(
      'tendermint.liquidity.v1beta1/QueryLiquidityPools',
      { options: { subscribe: false, all: true }, params: {} },
      { root: true },
    ));
  const pool = liquidityPools.pools.find((x) => x.pool_coin_denom == poolCoin.denom) ?? null;
  if (pool && pool.id == pool_id) {
    result.steps.push({
      name: 'withdrawliquidity',
      status: 'pending',
      data: {
        poolCoin,
        pool,
      },
    });
    return result;
  } else {
    //Pool does not exist, throw error for MVP. In the future implement as multiple swaps
    throw new Error('Pool does not exist');
  }
}