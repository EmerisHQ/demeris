import BigNumber from 'bignumber.js';
import { computed, ref, watch } from 'vue';

import { GlobalDemerisActionTypes } from '@/store/demeris/action-types';
import { Pool } from '@/types/actions';
import { getBaseDenom, getDisplayName } from '@/utils/actionHandler';
import { keyHashfromAddress, parseCoins } from '@/utils/basic';

import { store, useAllStores } from '../store/index';

export default function usePools() {
  const stores = useAllStores();

  const allPools = computed<Pool[]>(() => {
    return stores.getters['demeris/getAllValidPools'] ?? [];
  });

  const pools = ref(allPools.value);

  //  validPools(allPools.value).then((vp) => {
  //    pools.value = vp;
  //  });

  watch(
    () => allPools.value,
    async (newPools, oldPools) => {
      if (!oldPools) {
        return;
      }
      let oldIds = [];
      if (oldPools) {
        oldIds = oldPools.map((x) => x.id);
      }
      const newIds = newPools.map((x) => x.id);
      const addedIds = newIds.filter((x) => !oldIds.includes(x));
      if (addedIds.length > 0) {
        pools.value = newPools;
        const addedPools = newPools.filter((x) => addedIds.includes(x.id));
        for (const addedPool of addedPools) {
          const hashAddress = keyHashfromAddress(addedPool.reserve_account_address);

          store.dispatch(GlobalDemerisActionTypes.GET_POOL_BALANCES, {
            subscribe: false,
            params: { address: hashAddress },
          });
        }
      }
    },
    { immediate: true },
  );
  const updatePoolById = (id: string) => {
    const pool = pools.value.find((item) => item.id === id);
    if (pool) {
      updatePool(pool);
    }
  };
  const updatePool = (pool: Pool) => {
    const hashAddress = keyHashfromAddress(pool.reserve_account_address);

    store.dispatch(GlobalDemerisActionTypes.GET_POOL_BALANCES, {
      subscribe: false,
      params: { address: hashAddress },
    });
  };
  const formatPoolName = async (pool: Pool) => {
    return (
      await Promise.all(
        pool.reserve_coin_denoms.map(async (item) => await getDisplayName(item, store.getters['demeris/getDexChain'])),
      )
    ).join(' · ');
  };

  const getReserveBaseDenoms = async (pool: Pool) => {
    return Promise.all(pool.reserve_coin_denoms.map((denom) => getBaseDenom(denom)));
  };

  // reminder: when calling this function, use ibc/xxxx if the denom is an IBC denom (and NOT the base denom)
  const poolsByDenom = (denom: string) => {
    return pools.value.filter((item) => item.reserve_coin_denoms.includes(denom));
  };

  const poolById = (id: string) => {
    return pools.value.find((item) => item.id === id);
  };

  const poolPriceById = async (id: string) => {
    const pool = pools.value.find((item) => item.id === id);
    const balances = store.getters['demeris/getBalances']({
      address: keyHashfromAddress(pool.reserve_account_address),
    });

    const balanceA = balances.find((x) => {
      return parseCoins(x.amount)[0].denom == pool.reserve_coin_denoms[0];
    });
    const balanceB = balances.find((x) => {
      return parseCoins(x.amount)[0].denom == pool.reserve_coin_denoms[1];
    });
    return parseInt(parseCoins(balanceA.amount)[0].amount) / parseInt(parseCoins(balanceB.amount)[0].amount);
  };

  const withdrawBalancesById = (id: string, poolCoinAmount: number) => {
    const pool = pools.value.find((item) => item.id === id);

    if (!pool) {
      return;
    }

    const supplies = store.getters['cosmos.bank.v1beta1/getTotalSupply']();
    const totalSupply = supplies?.supply.find((token) => token.denom === pool.pool_coin_denom)?.amount;

    const reserveBalances = (
      store.getters['demeris/getBalances']({ address: keyHashfromAddress(pool.reserve_account_address) }) || []
    ).map((x) => {
      return parseCoins(x.amount)[0];
    });

    /**
     * TODO: Consider fee proportion
     * WithdrawAmount = ReserveAmount * PoolCoinAmount * WithdrawFeeProportion / TotalSupply
     * @see https://github.com/tendermint/liquidity/blob/develop/x/liquidity/keeper/liquidity_pool.go#L407
     */

    const hasParams = totalSupply && reserveBalances;

    const withdrawCoins = [
      {
        amount: !hasParams
          ? 0
          : new BigNumber(poolCoinAmount)
              .multipliedBy(reserveBalances[0]?.amount || 0)
              .dividedBy(totalSupply)
              .decimalPlaces(6)
              .toNumber(),
        denom: reserveBalances[0]?.denom || '',
      },
      {
        amount: !hasParams
          ? 0
          : new BigNumber(poolCoinAmount)
              .multipliedBy(reserveBalances[1]?.amount || 0)
              .dividedBy(totalSupply)
              .decimalPlaces(6)
              .toNumber(),
        denom: reserveBalances[1]?.denom || '',
      },
    ];

    return withdrawCoins;
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
          const poolId = pool.id;

          const poolCoin = {
            display_name: await getDisplayName(pool.pool_coin_denom, dexChain),
            base_denom: pool.pool_coin_denom,
            on_chain: dexChain,
            pool_id: poolId,
            amount: 0,
          };

          const reserveCoinFirst = {
            display_name: await getDisplayName(pool.reserve_coin_denoms[0], dexChain),
            base_denom: firstCoinBaseDenom,
            denom: pool.reserve_coin_denoms[0],
            on_chain: dexChain,
            amount: '0' + firstCoinBaseDenom,
            pool_id: poolId,
          };

          const reserveCoinSecond = {
            display_name: await getDisplayName(pool.reserve_coin_denoms[1], dexChain),
            base_denom: secondCoinBaseDenom,
            denom: pool.reserve_coin_denoms[1],
            on_chain: dexChain,
            amount: '0' + secondCoinBaseDenom,
            pool_id: poolId,
          };

          const denomsInfo = [poolCoin, reserveCoinFirst, reserveCoinSecond];
          if (isPoolCoin) {
            return denomsInfo;
          } else {
            return denomsInfo.filter((coin) => {
              return !coin.display_name.includes('Gravity');
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

    const balances = store.getters['demeris/getBalances']({
      address: keyHashfromAddress(pool.reserve_account_address),
    });

    const balanceA = balances.find((x) => {
      return parseCoins(x.amount)[0].denom == pool.reserve_coin_denoms[0];
    });
    const balanceB = balances.find((x) => {
      return parseCoins(x.amount)[0].denom == pool.reserve_coin_denoms[1];
    });
    return {
      balanceA: parseInt(parseCoins(balanceA.amount)[0].amount),
      balanceB: parseInt(parseCoins(balanceB.amount)[0].amount),
    };
  };
  const liquidityPriceById = async (id: string, amounts: number[]) => {
    const reserveDenoms = await getReserveBaseDenoms(await poolById(id));
    let total = 0;

    for (const [index, denom] of reserveDenoms.entries()) {
      const price = store.getters['demeris/getPrice']({ denom });
      const precision = store.getters['demeris/getDenomPrecision']({ name: denom }) || 6;

      total += (amounts[index] / Math.pow(10, precision)) * price;
    }
    return total;
  };
  const totalLiquidityPriceById = async (id: string) => {
    const reserveBalances = await reserveBalancesById(id);
    return liquidityPriceById(id, [reserveBalances.balanceA, reserveBalances.balanceB]);
  };
  return {
    allPools,
    pools,
    getReserveBaseDenoms,
    poolsByDenom,
    withdrawBalancesById,
    poolById,
    formatPoolName,
    poolPriceById,
    reserveBalancesById,
    denomListByPools,
    totalLiquidityPriceById,
    updatePool,
    updatePoolById,
  };
}
