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

  const denomListByPools = async (isPoolCoin = false) => {
    if (pools.value.length) {
      const list = [];
      const dexChain = store.getters['demeris/getDexChain'];
      async function getBaseDenom(denom) {
        if (denom.includes('ibc')) {
          return (
            store.getters['demeris/getVerifyTrace']({ chain_name: dexChain, hash: denom.split('/')[1] }) ??
            (await store.dispatch(
              'demeris/GET_VERIFY_TRACE',
              { subscribe: true, params: { chain_name: dexChain, hash: denom.split('/')[1] } },
              { root: true },
            ))
          ).base_denom;
        } else {
          return denom;
        }
      }
      const denoms = await Promise.all(
        pools.value.map(async (pool) => {
          const poolCoin = {
            display_name: await getDisplayName(pool.pool_coin_denom, dexChain),
            base_denom: pool.pool_coin_denom,
            on_chain: dexChain,
            amount: 230000000,
          };

          const reserveCoinFirst = {
            display_name: await getDisplayName(pool.reserve_coin_denoms[0], dexChain),
            base_denom: await getBaseDenom(pool.reserve_coin_denoms[0]),
            denom: pool.reserve_coin_denoms[0],
            on_chain: dexChain,
            amount: 230000000,
          };

          const reserveCoinSecond = {
            display_name: await getDisplayName(pool.reserve_coin_denoms[1], dexChain),
            base_denom: await getBaseDenom(pool.reserve_coin_denoms[1]),
            denom: pool.reserve_coin_denoms[1],
            on_chain: dexChain,
            amount: 230000000,
          };

          const denomsInfo = [poolCoin, reserveCoinFirst, reserveCoinSecond];
          if (isPoolCoin) {
            return denomsInfo;
          } else {
            return denomsInfo.filter((coin) => {
              return !coin.display_name.includes('GDEX');
            });
          }
        }),
      );

      denoms.forEach((denoms) => {
        list.push(...denoms);
      });

      function dedupe(arr) {
        return arr.reduce(
          function (p, c) {
            // create an identifying id from the object values
            const id = c.display_name;

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
    } else {
      return [];
    }
  };
  return { pools, poolsByDenom, poolById, formatPoolName, poolPriceById, denomListByPools };
}
