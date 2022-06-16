<template>
  <AppLayout>
    <div v-if="pool" class="md:flex justify-between">
      <main class="flex flex-col md:col-span-5 lg:col-span-5 w-full max-w-3xl lg:pr-px mb-16 md:mb-0">
        <header>
          <div class="text-muted mb-4">Gravity DEX Pool</div>
          <div class="sm:flex items-center flex-wrap gap-y-2">
            <div class="flex -space-x-1.5 mr-3 self-center">
              <CircleSymbol :denom="pool.reserve_coin_denoms[isReversePairName ? 1 : 0]" size="md" />
              <CircleSymbol :denom="pool.reserve_coin_denoms[isReversePairName ? 0 : 1]" size="md" />
            </div>
            <h1 class="text-2 font-bold mt-4 sm:mt-0 sm:mr-3 grow">{{ pairName }}</h1>
            <div class="text-muted mt-2">
              <template v-if="exchangeAmount">
                1 <Ticker :name="walletBalances.coinA.denom" /> &asymp; {{ exchangeAmount }}
                <Ticker :name="walletBalances.coinB.denom" />
              </template>
              <template v-else> Ratio is loading&hellip; </template>
            </div>
          </div>
          <CurrencyDisplay
            v-if="hasPrices.all"
            class="text-4 font-bold mt-3"
            :value="totalLiquidityPrice"
            small-decimals
          />
        </header>

        <section v-if="reserveBalances && walletBalances" class="mt-16">
          <h2 class="text-2 font-bold">Underlying assets</h2>

          <table class="assets-table table-fixed -ml-6 mt-4">
            <thead class="hidden md:table-header-group text-muted">
              <tr>
                <th class="align-middle -text-1 font-normal py-4 pr-0 sticky top-0 z-10 bg-app text-left">Asset</th>
                <th class="align-middle -text-1 font-normal py-4 px-0 sticky top-0 z-10 bg-app text-right">Quantity</th>
                <th class="align-middle -text-1 font-normal py-4 px-0 sticky top-0 z-10 bg-app text-right">Price</th>
                <th class="align-middle -text-1 font-normal py-4 px-0 sticky top-0 z-10 bg-app text-right">
                  Allocation
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(balance, index) of reserveBalances"
                :key="balance.denom"
                class="assets-table__row group cursor-pointer"
                @click="openAssetPage(balance)"
              >
                <td class="py-5 align-middle group-hover:bg-fg transition">
                  <div class="flex items-center">
                    <CircleSymbol :denom="balance.denom" class="assets-table__row__denom__avatar" />
                    <div class="ml-4 whitespace-nowrap overflow-hidden text-ellipsis min-w-0">
                      <span class="font-medium"><Ticker :name="balance.denom" /></span>
                    </div>
                  </div>
                </td>
                <td class="py-5 align-middle text-right text-muted group-hover:bg-fg transition">
                  <AmountDisplay :amount="balance" />
                </td>
                <td class="py-5 align-middle text-right group-hover:bg-fg transition">
                  <Price :amount="{ denom: balance.denom, amount: 0 }" />
                </td>
                <td class="py-5 align-middle text-right group-hover:bg-fg transition">
                  <Price v-if="hasPrices[index === 0 ? 'coinA' : 'coinB']" :amount="balance" class="font-medium" />
                  <span v-else>–</span>
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        <section v-if="reserveBalances && walletBalances" class="mt-16">
          <h2 class="text-2 font-bold">Liquidity pool token</h2>

          <table class="assets-table table-fixed -ml-6 mt-6">
            <thead class="hidden md:table-header-group text-muted">
              <tr>
                <th class="align-middle -text-1 font-normal py-4 pr-0 sticky top-0 z-10 bg-app text-left">Asset</th>
                <th class="align-middle -text-1 font-normal py-4 px-0 sticky top-0 z-10 bg-app text-center">Ticker</th>
                <th class="align-middle -text-1 font-normal py-4 px-0 sticky top-0 z-10 bg-app text-right">Price</th>
                <th class="align-middle -text-1 font-normal py-4 px-0 sticky top-0 z-10 bg-app text-right">
                  Allocation
                </th>
              </tr>
            </thead>

            <tbody>
              <tr class="assets-table__row group cursor-pointer" @click="openAssetPage(walletBalances.poolCoin)">
                <td class="py-5 align-middle group-hover:bg-fg transition">
                  <div class="flex items-center">
                    <CircleSymbol :denom="walletBalances.poolCoin.denom" class="assets-table__row__denom__avatar" />
                    <div class="ml-4 whitespace-nowrap overflow-hidden text-ellipsis min-w-0">
                      <span class="font-medium"><Ticker :name="walletBalances.poolCoin.denom" /></span>
                    </div>
                  </div>
                </td>
                <td class="py-5 align-middle text-center group-hover:bg-fg transition">
                  <Denom :name="walletBalances.poolCoin.denom" />
                </td>
                <td class="py-5 align-middle text-right group-hover:bg-fg transition">
                  <Price :amount="{ denom: walletBalances.poolCoin.denom, amount: 0 }" />
                </td>
                <td class="py-5 align-middle text-right group-hover:bg-fg transition">
                  <CurrencyDisplay v-if="hasPrices.all" class="font-medium" :value="totalLiquidityPrice" />
                  <span v-else>–</span>
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        <section v-if="relatedPools.length" class="mt-16">
          <header class="flex items-baseline justify-between">
            <h2 class="text-2 font-bold">More pools</h2>
            <router-link
              :to="{ name: 'Pools' }"
              class="font-medium hover:opacity-80 active:opacity-70 transition select-none"
            >
              See all &rarr;
            </router-link>
          </header>

          <Pools class="mt-8" :pools="relatedPools" />
        </section>
      </main>

      <aside class="flex flex-col mx-auto md:ml-8 lg:ml-12 md:mr-0 items-end max-w-xs">
        <section class="pool-equity w-full rounded-2xl bg-gold-circular">
          <div v-if="walletBalances" class="pool-equity__inner m-0.5 bg-app p-6">
            <div class="flex items-end justify-between">
              <h2 class="text-muted">Equity</h2>
              <CircleSymbol :denom="walletBalances.poolCoin.denom" size="md" />
            </div>
            <p v-if="hasPrices.all" class="mt-1 text-2 font-bold">
              <CurrencyDisplay :value="hasPrices.all ? (ownShare / 100) * totalLiquidityPrice : 0" />
            </p>
            <p class="text-muted mt-1">
              <AmountDisplay :amount="walletBalances.poolCoin" class="text-text" /><span class="mx-1.5">&middot;</span
              ><span> {{ ownShare.toFixed(2) }}% of pool </span>
            </p>

            <div v-if="walletBalances.poolCoin?.amount > 0" class="mt-8">
              <h3 class="text-muted -text-1">Assets provided</h3>
              <ul class="mt-2">
                <li class="flex w-full py-2 gap-x-1">
                  <CircleSymbol :denom="walletBalances.coinA.denom" size="xs" />
                  <AmountDisplay :amount="walletBalances.coinA" class="ml-2 font-medium grow" />
                  <span v-if="hasPrices.coinA"><Price :amount="walletBalances.coinA" /></span>
                  <span v-else>-</span>
                </li>
                <li class="flex w-full py-2 gap-x-1">
                  <CircleSymbol :denom="walletBalances.coinB.denom" size="xs" />
                  <AmountDisplay :amount="walletBalances.coinB" class="ml-2 font-medium grow" />
                  <span v-if="hasPrices.coinB"><Price :amount="walletBalances.coinB" /></span>
                  <span v-else>-</span>
                </li>
              </ul>
            </div>

            <div class="flex justify-between w-full gap-x-3 mt-6">
              <FeatureRunningConditional name="DISABLE_ADD_LIQUIDITY">
                <template #deactivated>
                  <Button
                    :name="walletBalances.poolCoin?.amount > 0 ? 'Add' : 'Add liquidity'"
                    class="flex-1"
                    :click-function="addLiquidityHandler"
                  />
                </template>
              </FeatureRunningConditional>
              <Button
                v-if="walletBalances.poolCoin?.amount > 0"
                name="Withdraw"
                class="flex-1"
                :click-function="withdrawLiquidityHandler"
              />
            </div>
          </div>
        </section>
        <FeatureRunningConditional name="DISABLE_ADD_LIQUIDITY">
          <template #default>
            <div class="my-10 -text-1 flex mx-auto">
              <b>{{ $t('context.pools.disabled.description') }}</b> &nbsp;
              <a
                variant="link"
                href="https://support.emeris.com/en/articles/6095013-how-to-withdraw-your-funds-from-liquidity-pools"
              >
                {{ $t('context.pools.disabled.linkText') }} ↗
              </a>
            </div>
          </template>
        </FeatureRunningConditional>
      </aside>
    </div>
    <SkeletonLoader v-else width="100%" height="300px" />
  </AppLayout>
</template>

<script lang="ts" setup>
/* eslint-disable max-lines */
import BigNumber from 'bignumber.js';
import { computed, Ref, ref, unref, watch } from 'vue';
import { useMeta } from 'vue-meta';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';

import AmountDisplay from '@/components/common/AmountDisplay.vue';
import CircleSymbol from '@/components/common/CircleSymbol.vue';
import Denom from '@/components/common/Denom.vue';
import FeatureRunningConditional from '@/components/common/FeatureRunningConditional.vue';
import SkeletonLoader from '@/components/common/loaders/SkeletonLoader.vue';
import Price from '@/components/common/Price.vue';
import Ticker from '@/components/common/Ticker.vue';
import Pools from '@/components/liquidity/Pools.vue';
import Button from '@/components/ui/Button.vue';
import CurrencyDisplay from '@/components/ui/CurrencyDisplay.vue';
import useAccount from '@/composables/useAccount';
import usePool from '@/composables/usePool';
import usePools from '@/composables/usePools';
import AppLayout from '@/layouts/AppLayout.vue';
import { GlobalGetterTypes, RootStoreTyped } from '@/store';
import { pageview } from '@/utils/analytics';
import { parseCoins } from '@/utils/basic';

const router = useRouter();
const route = useRoute();
const typedstore = useStore() as RootStoreTyped;
const denoms = ref([]);
pageview({ page_title: 'Pool: ' + route.params.id, page_path: '/pool/' + route.params.id });

const poolId = computed(() => route.params.id as string);

const { balancesByDenom } = useAccount();
const { filterPoolsByDenom, getReserveBaseDenoms } = usePools();

const hasPrices = computed(() => {
  let baseDenoms = denoms.value;
  if (!baseDenoms.length) {
    baseDenoms = pool.value.reserve_coin_denoms;
  }
  const coinA = !!typedstore.getters[GlobalGetterTypes.API.getPrice]({ denom: baseDenoms[0] });
  const coinB = !!typedstore.getters[GlobalGetterTypes.API.getPrice]({ denom: baseDenoms[1] });
  const all = coinA && coinB;

  return {
    coinA,
    coinB,
    all,
  };
});

const usePoolInstance: Ref<ReturnType<typeof usePool>> = ref(null);

watch(
  () => poolId.value,
  async () => {
    const inst = usePool(poolId);
    await inst.initPromise;
    usePoolInstance.value = inst;
  },
  { immediate: true },
);

const pool = computed(() => {
  return unref(usePoolInstance.value?.pool);
});

const pairName = computed(() => {
  return unref(usePoolInstance.value?.pairName);
});

const isReverse = computed(() => {
  const firstDenom = pool.value?.reserve_coin_denoms[isReversePairName.value ? 1 : 0];
  const reserveBalanceFirstDenom = usePoolInstance.value?.reserveBalances[0]?.denom;
  return firstDenom !== reserveBalanceFirstDenom;
});

const reserveBalances = computed(() => {
  return unref(
    isReverse.value ? [...usePoolInstance.value?.reserveBalances].reverse() : usePoolInstance.value?.reserveBalances,
  );
});

const totalSupply = computed(() => {
  return unref(usePoolInstance.value?.totalSupply);
});

const totalLiquidityPrice = computed(() => {
  return unref(usePoolInstance.value?.totalLiquidityPrice);
});

const isReversePairName = computed(() => {
  return unref(usePoolInstance.value?.isReversePairName);
});

const metaSource = computed(() => ({
  title: pairName.value ? pairName.value : 'Gravity DEX Pool',
}));
useMeta(metaSource);

const walletBalances = computed(() => {
  if (!pool.value || !reserveBalances.value?.length) {
    return;
  }

  const poolCoinBalances = balancesByDenom(pool.value.pool_coin_denom);

  const poolCoin = {
    denom: pool.value.pool_coin_denom,
    base_denom: pool.value.pool_coin_denom,
    amount: poolCoinBalances.reduce((acc, item) => acc + +parseCoins(item.amount)[0].amount, 0),
  };

  const withdrawBalances = isReverse.value
    ? usePoolInstance.value.getPoolWithdrawBalances(poolCoin.amount).reverse()
    : usePoolInstance.value.getPoolWithdrawBalances(poolCoin.amount);

  return {
    coinA: withdrawBalances[0],
    coinB: withdrawBalances[1],
    poolCoin,
  };
});

const exchangeAmount = computed(() => {
  if (!reserveBalances.value?.length) {
    return;
  }

  const fromPrecision =
    typedstore.getters[GlobalGetterTypes.API.getDenomPrecision]({
      name: reserveBalances.value[0].base_denom,
    }) ?? 6;
  const toPrecision =
    typedstore.getters[GlobalGetterTypes.API.getDenomPrecision]({
      name: reserveBalances.value[1].base_denom,
    }) ?? 6;
  const balanceA = reserveBalances.value[0].amount;
  const balanceB = reserveBalances.value[1].amount;
  if (balanceA && balanceB) {
    return Math.round((balanceB / balanceA / 10 ** Math.abs(fromPrecision - toPrecision)) * 100) / 100;
  }
  return undefined;
});

const relatedPools = computed(() => {
  // TODO: Order by descending  %ownership
  return [
    ...filterPoolsByDenom(pool.value.reserve_coin_denoms[0]),
    ...filterPoolsByDenom(pool.value.reserve_coin_denoms[1]),
  ]
    .filter((item) => item.id !== pool.value.id)
    .slice(0, 3);
});

const addLiquidityHandler = () => {
  router.push({ name: 'AddLiquidity', params: { id: pool.value.id } });
};

const withdrawLiquidityHandler = () => {
  router.push({ name: 'WithdrawLiquidity', params: { id: pool.value.id } });
};

const updateDenoms = async () => {
  if (!pool.value) {
    return;
  }

  const reserveDenoms = await getReserveBaseDenoms(pool.value);
  denoms.value = reserveDenoms;
};

const ownShare = computed(() => {
  if (!pool.value || !totalSupply.value || !walletBalances.value.poolCoin.amount) {
    return 0;
  }

  return new BigNumber(walletBalances.value.poolCoin.amount).dividedBy(totalSupply.value).multipliedBy(100).toNumber();
});

const openAssetPage = (asset: Record<string, string>) => {
  router.push({ name: 'Asset', params: { denom: asset.base_denom } });
};

watch(reserveBalances, updateDenoms, { immediate: true });
</script>

<style lang="scss" scoped>
.assets-table {
  width: calc(100% + 3rem);
  td,
  th {
    &:first-child {
      padding-left: 1.5rem;
      border-top-left-radius: 0.75rem;
      border-bottom-left-radius: 0.75rem;
    }

    &:last-child {
      padding-right: 1.5rem;
      border-top-right-radius: 0.75rem;
      border-bottom-right-radius: 0.75rem;
    }
  }
}

.pool-equity {
  min-width: 20rem;
  &__inner {
    border-radius: 0.875rem; // ~14px
  }
}
</style>
