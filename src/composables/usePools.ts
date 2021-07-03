import { computed } from 'vue';

import { Pool } from '@/types/actions';
import { getDisplayName } from '@/utils/actionHandler';

import { store, useAllStores } from '../store/index';

export default function usePools() {
  const stores = useAllStores();

  const pools = computed<Pool[]>(() => {
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

  const poolById = (id: number) => {
    return pools.value.find((item) => item.id === id);
  };

  const poolPriceById = async (id: number) => {
    const pool = pools.value.find((item) => item.id === id);
    const balances = (
      await stores.dispatch('cosmos.bank.v1beta1/QueryAllBalances', {
        params: { address: pool.reserve_account_address },
      })
    ).balances;
    const balanceA = balances.find((x) => x.denom == pool.reserve_coin_denoms[0]);
    const balanceB = balances.find((x) => x.denom == pool.reserve_coin_denoms[1]);
    return parseInt(balanceA.amount) / parseInt(balanceB.amount);
  };

  const denomListByPools = async () => {
    const list = [];
    console.log('tetsettsts', pools.value);
    const denoms = await Promise.all(
      pools.value.map(async (pool) => {
        const poolCoin = {
          displayName: await getDisplayName(pool.pool_coin_denom, store.getters['demeris/getDexChain']),
          denom: pool.pool_coin_denom,
        };
        const reserveCoinFirst = {
          displayName: await getDisplayName(pool.reserve_coin_denoms[0], store.getters['demeris/getDexChain']),
          denom: pool.reserve_coin_denoms[0],
        };
        const reserveCoinSecond = {
          displayName: await getDisplayName(pool.reserve_coin_denoms[1], store.getters['demeris/getDexChain']),
          denom: pool.reserve_coin_denoms[1],
        };
        const denoms = [poolCoin, reserveCoinFirst, reserveCoinSecond];
        return denoms;
      }),
    );

    denoms.forEach((denoms) => {
      list.push(...denoms);
    });

    function dedupe(arr) {
      return arr.reduce(
        function (p, c) {
          // create an identifying id from the object values
          const id = c.denom;

          // if the id is not found in the temp array
          // add the object to the output array
          // and add the key to the temp array
          if (p.temp.indexOf(id) === -1) {
            p.out.push(c);
            p.temp.push(id);
          }
          return p;

          // return the deduped array
        },
        {
          temp: [],
          out: [],
        },
      ).out;
    }

    return dedupe(list);
  };
  return { pools, poolsByDenom, poolById, formatPoolName, poolPriceById, denomListByPools };
}
