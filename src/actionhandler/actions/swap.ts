import { GlobalDemerisGetterTypes, RootStoreType } from '@/store';
import { Amount } from '@/types/base';
import { useStore } from '@/utils/useStore';

export async function swap({ from, to }: { from: Amount; to: Amount }) {
  const libStore = useStore();
  const store = libStore as RootStoreType;
  // Get the list of available pools
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
    store.getters['tendermint.liquidity.v1beta1/getLiquidityPools']() ??
    (await libStore.dispatch(
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
      name: 'swap',
      status: 'pending',
      data: {
        from,
        to,
        pool,
      },
    });
    result.output = {
      amount: {
        amount: 0,
        denom: to.denom,
      },
      chain_name: store.getters[GlobalDemerisGetterTypes.API.getDexChain],
    };
    return result;
  } else {
    //Pool does not exist, throw error for MVP. In the future implement as multiple swaps
    throw new Error('Pool does not exist');
  }
}
