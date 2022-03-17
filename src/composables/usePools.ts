import BigNumber from 'bignumber.js';
import { computed, ref, watch } from 'vue';

import { GlobalActionTypes, GlobalGetterTypes, RootStoreTyped } from '@/store';
import { Pool } from '@/types/actions';
import { getBaseDenom, getTicker } from '@/utils/actionHandler';
import { keyHashfromAddress, parseCoins } from '@/utils/basic';
import { useStore } from '@/utils/useStore';

let usePoolsInstance = null;
function usePools() {
  let init = false;

  let initialized;
  const initPromise = new Promise((resolve) => {
    initialized = resolve;
  });
  const store = useStore();
  const typedstore = store as RootStoreTyped;
  // Pool validation has been moved to the Vuex store so allPools only contains validated pools
  const allPools = computed<Pool[]>(() => {
    return typedstore.getters[GlobalGetterTypes.API.getAllValidPools];
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
      if (newPools === null) {
        return;
      }
      if (newPools.length > 0) {
        if (!oldPools && init) {
          return;
        }
        init = true;
        let oldIds = [];
        if (oldPools) {
          oldIds = oldPools.map((x) => x.id);
        }
        const newIds = newPools.map((x) => x.id);
        const addedIds = newIds.filter((x) => !oldIds.includes(x));
        if (addedIds.length > 0) {
          pools.value = newPools;
          const addedPools = newPools.filter((x) => addedIds.includes(x.id));
          await Promise.all(
            addedPools.map(async (addedPool) => {
              const hashAddress = keyHashfromAddress(addedPool.reserve_account_address);
              await typedstore.dispatch(GlobalActionTypes.API.GET_POOL_BALANCES, {
                subscribe: false,
                params: { address: hashAddress },
              });
            }),
          );
        }
      } else {
        pools.value = newPools;
      }
      initialized();
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
    return pools.value?.find((item) => item.id === id) ?? null;
  };

  /*
    For performance reasons we do not subscribe to GET_POOL_BALANCES.
    Following function is used to trigger updates as needed
  */
  const updatePool = async (pool: Pool) => {
    await initPromise;
    const hashAddress = keyHashfromAddress(pool.reserve_account_address);
    typedstore.dispatch(GlobalActionTypes.API.GET_POOL_BALANCES, {
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
        pool.reserve_coin_denoms.map(
          async (item) => await getTicker(item, typedstore.getters[GlobalGetterTypes.API.getDexChain]),
        ),
      )
    )
      .sort()
      .join(' · ');
  };

  const getReserveBaseDenoms = async (pool: Pool) => {
    return await Promise.all(pool?.reserve_coin_denoms.map((denom) => getBaseDenom(denom)) ?? []);
  };

  /*
    compare an order of reserve denoms to an order of tickers
    ex: basecro, uatom <=> ATOM, CRO (true)
  */
  const getIsReversePairName = async (pool: Pool, poolName: string) => {
    if (!pool?.reserve_coin_denoms[0] || !pool) {
      return;
    }
    return (
      poolName?.split(' · ')[0] !==
      (await getTicker(pool.reserve_coin_denoms[0], typedstore.getters[GlobalGetterTypes.API.getDexChain]))
    );
  };

  // reminder: when calling this function, use ibc/xxxx if the denom is an IBC denom (and NOT the base denom)
  const filterPoolsByDenom = (denom: string) => {
    return pools.value?.filter((item) => item.reserve_coin_denoms.includes(denom)) ?? [];
  };

  const getPoolPrice = async (pool: Pool) => {
    const balances = typedstore.getters[GlobalGetterTypes.API.getBalances]({
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
      typedstore.getters[GlobalGetterTypes.API.getBalances]({
        address: keyHashfromAddress(pool.reserve_account_address),
      }) || []
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
    const balances = typedstore.getters[GlobalGetterTypes.API.getBalances]({
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
    getIsReversePairName,
    getReserveBaseDenoms,
    filterPoolsByDenom,
    getPoolPrice,
    getWithdrawBalances,
    getNextPoolId,
    getReserveBalances,
    initPromise,
  };
}
export default function usePoolsFactory() {
  if (!usePoolsInstance) {
    usePoolsInstance = usePools();
  }
  return usePoolsInstance as ReturnType<typeof usePools>;
}
