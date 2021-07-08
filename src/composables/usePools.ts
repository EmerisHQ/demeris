import { computed } from 'vue';

import { Pool } from '@/types/actions';
import { getBaseDenom, getDisplayName } from '@/utils/actionHandler';

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

  const getReserveBaseDenoms = async (pool: Pool) => {
    return Promise.all(pool.reserve_coin_denoms.map((denom) => getBaseDenom(denom)));
  };

  const poolsByDenom = (denom: string) => {
    return pools.value.filter((item) => item.reserve_coin_denoms.includes(denom));
  };

  const poolById = (id: string) => {
    return pools.value.find((item) => item.id === id);
  };

  const poolPriceById = async (id: string) => {
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
          const firstCoinBaseDenom = await getBaseDenom(pool.reserve_coin_denoms[0]);
          const secondCoinBaseDenom = await getBaseDenom(pool.reserve_coin_denoms[1]);

          const poolCoin = {
            display_name: await getDisplayName(pool.pool_coin_denom, dexChain),
            base_denom: pool.pool_coin_denom,
            on_chain: dexChain,
            amount: 0,
          };

          const reserveCoinFirst = {
            display_name: await getDisplayName(pool.reserve_coin_denoms[0], dexChain),
            base_denom: firstCoinBaseDenom,
            denom: pool.reserve_coin_denoms[0],
            on_chain: dexChain,
            amount: '0' + firstCoinBaseDenom,
          };

          const reserveCoinSecond = {
            display_name: await getDisplayName(pool.reserve_coin_denoms[1], dexChain),
            base_denom: secondCoinBaseDenom,
            denom: pool.reserve_coin_denoms[1],
            on_chain: dexChain,
            amount: '0' + secondCoinBaseDenom,
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

  const reserveBalancesById = async (id: string) => {
    const pool = pools.value.find((item) => item.id === id);
    const balances = (
      await stores.dispatch('cosmos.bank.v1beta1/QueryAllBalances', {
        params: { address: pool.reserve_account_address },
      })
    ).balances;
    const balanceA = balances.find((x) => x.denom == pool.reserve_coin_denoms[0]);
    const balanceB = balances.find((x) => x.denom == pool.reserve_coin_denoms[1]);
    return { balanceA: balanceA.amount, balanceB: balanceB.amount };
  };
  const totalLiquidityPriceById = async (id) => {
    const reserveDenoms = await getReserveBaseDenoms(await poolById(id));
    const reserveBalances = await reserveBalancesById(id);
    let total = 0;

    for (const [index, denom] of reserveDenoms.entries()) {
      const price = store.getters['demeris/getPrice']({ denom });
      const precision = store.getters['demeris/getDenomPrecision']({ name: denom }) || 6;

      total += (reserveBalances[index].amount / Math.pow(10, precision)) * price;
    }
    return total;
  };
  return {
    pools,
    getReserveBaseDenoms,
    poolsByDenom,
    poolById,
    formatPoolName,
    poolPriceById,
    reserveBalancesById,
    denomListByPools,
  };
}
