import { AbstractAmount } from '@emeris/types/lib/EmerisTransactions';

import { GlobalGetterTypes, RootStoreTyped } from '@/store';
import { ActionStepResult } from '@/types/actions';
import { useStore } from '@/utils/useStore';

export async function swap({ from, to }: { from: AbstractAmount; to: AbstractAmount }) {
  const store = useStore();
  const typedstore = store as RootStoreTyped;
  // Get the list of available pools
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

  // create our asset pair sorted alphabetically
  const assetPair = [from.denom, to.denom].sort();

  // Find the pool for that pair
  const pool =
    liquidityPools.pools.find((x) => JSON.stringify(x.reserve_coin_denoms) == JSON.stringify(assetPair)) ?? null;
  if (pool) {
    //Pool exists, proceed with swap
    result.steps.push({
      type: 'swap',
      status: 'pending',
      data: {
        from,
        to,
        pool,
        chainName: typedstore.getters[GlobalGetterTypes.API.getDexChain],
      },
    });
    result.output = {
      amount: '0',
      denom: to.denom,
      base_denom: to.base_denom,
      chain_name: typedstore.getters[GlobalGetterTypes.API.getDexChain],
    };
    return result;
  } else {
    //Pool does not exist, throw error for MVP. In the future implement as multiple swaps
    throw new Error('Pool does not exist');
  }
}
