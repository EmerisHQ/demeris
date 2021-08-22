import BigNumber from 'bignumber.js';
import { computed, onMounted, ref, watch } from 'vue';

import { GlobalDemerisActionTypes } from '@/store/demeris/action-types';
import { store, useAllStores } from '@/store/index';
import { Pool } from '@/types/actions';
import { getBaseDenom, getDisplayName } from '@/utils/actionHandler';
import { keyHashfromAddress, parseCoins } from '@/utils/basic';

export default function usePools() {
  const stores = useAllStores();

  // Pool validation has been moved to the Vuex store so allPools only contains validated pools
  const allPools = computed<Pool[]>(() => {
    return stores.getters['demeris/getAllValidPools'] ?? [];
  });

  /*
     Following reference and watcher ensure that
     a. pools is ONLY updated if the list of pools changes to avoid expensive recalculations/rerenders
     b. we get the pool's reserve account balances for any newly added pools
  */
  const pools = ref(allPools.value);
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
  /*
    All helper functions accept a specific pool as an argument.
    To allow them to be used via pool_id only, we add the following function.
    Goal is to avoid declarations such as:
    helperFunction(pool: Pool) and  helperFunctionById(pool_id: string)
    but use:
    helperFunction(pool) and helperFunction(poolById(pool_id)) 
    if necessary
  */

  const getPoolById = (id: string) => {
    return pools.value.find((item) => item.id === id) ?? null;
  };

  /*
    For performance reasons we do not subscribe to GET_POOL_BALANCES.
    Following function is used to trigger updates as needed
  */
  const updatePool = (pool: Pool) => {
    const hashAddress = keyHashfromAddress(pool.reserve_account_address);
    store.dispatch(GlobalDemerisActionTypes.GET_POOL_BALANCES, {
      subscribe: false,
      params: { address: hashAddress },
    });
  };
  const getPoolName = async (pool: Pool) => {
    if (!pool) {
      return '-/-';
    }
    return (
      await Promise.all(
        pool.reserve_coin_denoms.map(async (item) => await getDisplayName(item, store.getters['demeris/getDexChain'])),
      )
    ).join(' · ');
  };

  const getReserveBaseDenoms = async (pool: Pool) => {
    return await Promise.all(pool?.reserve_coin_denoms.map((denom) => getBaseDenom(denom)) ?? []);
  };

  // reminder: when calling this function, use ibc/xxxx if the denom is an IBC denom (and NOT the base denom)
  const filterPoolsByDenom = (denom: string) => {
    return pools.value.filter((item) => item.reserve_coin_denoms.includes(denom));
  };

  const getPoolPrice = async (pool: Pool) => {
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

  const getLiquidityShare = (pool: Pool, poolCoinAmount: number) => {
    if (!pool) {
      return;
    }

    const supplies = store.getters['cosmos.bank.v1beta1/getTotalSupply']();
    const totalSupply = supplies?.supply.find((token) => token.denom === pool.pool_coin_denom)?.amount;

    return new BigNumber(poolCoinAmount).dividedBy(totalSupply).multipliedBy(100).toNumber();
  };

  const getWithdrawBalances = (pool: Pool, poolCoinAmount: number) => {
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
  const getNextPoolId = () => {
    return store.getters['tendermint.liquidity.v1beta1/getLiquidityPools']().pools.length + 1;
  };
  const getReserveBalances = async (pool: Pool) => {
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

  return {
    pools,
    getLiquidityShare,
    getPoolById,
    updatePool,
    getPoolName,
    getReserveBaseDenoms,
    filterPoolsByDenom,
    getPoolPrice,
    getWithdrawBalances,
    getNextPoolId,
    getReserveBalances,
  };
}
