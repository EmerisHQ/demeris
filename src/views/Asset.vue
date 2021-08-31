<template>
  <AppLayout>
    <div class="md:flex justify-between">
      <main class="flex flex-col md:col-span-5 lg:col-span-5 w-full max-w-3xl lg:pr-px mb-16 md:mb-0">
        <!-- Info -->

        <header>
          <div class="sm:flex items-center flex-wrap gap-y-3">
            <CircleSymbol :denom="denom" size="md" class="mr-3" />
            <div class="flex-grow flex items-baseline justify-between flex-nowrap">
              <div class="sm:flex items-baseline flex-wrap">
                <h1 class="text-1 sm:text-2 font-bold mt-4 sm:mt-0 sm:mr-3"><Denom :name="denom" /></h1>
                <span class="text-muted text-0 mt-2 flex-grow"><Ticker :name="denom" /></span>
              </div>
              <Price
                v-tippy
                :amount="{ amount: 0, denom }"
                class="text-1 sm:text-2 font-bold"
                content="Current asset price"
              />
            </div>
          </div>
        </header>

        <!-- Balance -->

        <MoonpayBanner v-if="!assets.length && denom === 'uatom'" class="mt-16" size="large" />

        <section v-else class="mt-16">
          <header class="space-y-0.5">
            <h2 class="text-muted">{{ $t('pages.asset.balance') }}</h2>
            <Price :amount="{ amount: totalAmount, denom }" :show-zero="true" class="text-3 font-bold" />
            <div class="text-muted">
              <AmountDisplay :amount="{ amount: totalAmount, denom }" />
            </div>
          </header>

          <dl
            class="border border-border rounded-xl grid gap-4 p-4 mt-6"
            :class="assetConfig?.stakable ? 'grid-cols-3' : 'grid-cols-2'"
          >
            <div>
              <dt class="text-muted">{{ $t('pages.asset.available') }}</dt>
              <dd class="font-medium mt-0.5">
                <AmountDisplay :amount="{ amount: availableAmount, denom }" />
              </dd>
            </div>

            <div v-if="assetConfig?.stakable">
              <dt class="text-muted">{{ $t('pages.asset.staked') }}</dt>
              <dd class="font-medium mt-0.5">
                <AmountDisplay :amount="{ amount: stakedAmount, denom }" />
              </dd>
            </div>

            <div>
              <dt class="text-muted">{{ $t('pages.asset.pooled') }}</dt>
              <dd class="font-medium mt-0.5">
                <tippy>
                  <AmountDisplay :amount="{ amount: pooledAmount, denom }" />
                  <template #content>
                    <TooltipPools :pools="poolsInvestedWithAsset" :denom="denom" />
                  </template>
                </tippy>
              </dd>
            </div>
          </dl>
        </section>

        <!-- Chains -->

        <section v-if="assets.length" class="mt-16">
          <h2 class="text-2 font-bold">{{ $t('pages.asset.chains') }}</h2>

          <ul class="mt-6">
            <li
              v-for="(asset, index) of assets"
              :key="asset.address + '_' + index"
              class="flex items-center justify-between w-full py-5"
            >
              <div class="w-1/3 flex items-center min-w-0">
                <CircleSymbol :denom="denom" :chain-name="asset.on_chain" size="lg" :glow="false" variant="chain" />
                <span class="flex-grow ml-4 font-medium whitespace-nowrap overflow-hidden overflow-ellipsis"><ChainName :name="asset.on_chain" /></span>
              </div>
              <div class="w-1/3 ml-4 text-muted text-right">
                <AmountDisplay
                  v-if="assetConfig && asset.on_chain === assetConfig.chain_name"
                  :amount="{ amount: parseInt(asset.amount.slice(0, -4)) + stakedAmount + 'uatom', denom }"
                />
                <AmountDisplay v-else :amount="{ amount: asset.amount, denom }" />
              </div>
              <div class="w-1/3 ml-4">
                <span class="text-right font-medium">
                  <Price
                    v-if="assetConfig && asset.on_chain === assetConfig.chain_name"
                    :amount="{ amount: parseInt(asset.amount.slice(0, -4)) + stakedAmount + 'uatom', denom }"
                  />
                  <Price v-else :amount="{ amount: asset.amount, denom }" />
                </span>
              </div>
            </li>
          </ul>
        </section>

        <!-- Pools -->

        <section v-if="poolsDisplay.length" class="mt-16">
          <header class="flex items-baseline justify-between">
            <h2 class="text-2 font-bold">{{ $t('pages.asset.pools') }}</h2>
            <router-link
              :to="{ name: 'Pools' }"
              class="font-medium hover:opacity-80 active:opacity-70 transition select-none"
            >
              {{ $t('generic_cta.seeall') }} &rarr;
            </router-link>
          </header>

          <Pools :pools="poolsDisplay" class="mt-8" />
        </section>

        <!-- Staking -->

        <section v-if="assetConfig?.stakable" class="mt-16">
          <h2 class="text-2 font-bold">{{ $t('pages.asset.staking') }}</h2>

          <StakeTable class="mt-8" :denom="denom" />
        </section>
      </main>

      <!-- Swap -->

      <aside class="flex flex-col mx-auto md:ml-8 lg:ml-12 md:mr-0 items-end max-w-xs">
        <LiquiditySwap :default-asset="nativeAsset" />
        <PoolBanner v-if="isPoolCoin" :name="denom" />
        <MoonpayBanner v-if="assets.length && denom == 'uatom'" size="small" class="mt-4" />
      </aside>
    </div>
  </AppLayout>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';
import { useMeta } from 'vue-meta';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';

import PoolBanner from '@/components/assets/AssetsTable/PoolBanner.vue';
import AmountDisplay from '@/components/common/AmountDisplay.vue';
import ChainName from '@/components/common/ChainName.vue';
import CircleSymbol from '@/components/common/CircleSymbol.vue';
import Denom from '@/components/common/Denom.vue';
import MoonpayBanner from '@/components/common/MoonpayBanner.vue';
import Price from '@/components/common/Price.vue';
import StakeTable from '@/components/common/StakeTable.vue';
import Ticker from '@/components/common/Ticker.vue';
import Pools from '@/components/liquidity/Pools.vue';
import LiquiditySwap from '@/components/liquidity/Swap.vue';
import TooltipPools from '@/components/liquidity/TooltipPools.vue';
import useAccount from '@/composables/useAccount';
import usePools from '@/composables/usePools';
import AppLayout from '@/layouts/AppLayout.vue';
import { VerifiedDenoms } from '@/types/api';
import { getDisplayName } from '@/utils/actionHandler';
import { pageview } from '@/utils/analytics';
import { generateDenomHash, parseCoins } from '@/utils/basic';

export default defineComponent({
  name: 'Asset',

  components: {
    AmountDisplay,
    ChainName,
    Denom,
    Ticker,
    CircleSymbol,
    StakeTable,
    AppLayout,
    Price,
    LiquiditySwap,
    Pools,
    TooltipPools,
    PoolBanner,
    MoonpayBanner,
  },

  setup() {
    const displayName = ref('');
    const metaSource = computed(() => {
      return { title: displayName.value };
    });
    useMeta(metaSource);
    const isPoolCoin = computed(() => {
      return denom.value.startsWith('pool');
    });
    const store = useStore();
    const route = useRoute();
    const denom = computed(() => route.params.denom as string);

    pageview({ page_title: 'Asset: ' + route.params.denom, page_path: '/asset/' + route.params.denom });
    const { balances, balancesByDenom, stakingBalancesByChain, nativeBalances } = useAccount();
    const { filterPoolsByDenom, getWithdrawBalances } = usePools();

    const assetConfig = computed(() => {
      const verifiedDenoms: VerifiedDenoms = store.getters['demeris/getVerifiedDenoms'] || [];
      return verifiedDenoms.find((item) => item.name === denom.value);
    });

    const nativeAsset = computed(() => {
      return nativeBalances.value.find((item) => item.base_denom === denom.value);
    });

    const assets = computed(() => balancesByDenom(denom.value));

    const poolDenom = ref(denom.value);

    watch(
      denom,
      async () => {
        const dexChain = store.getters['demeris/getDexChain'];

        if (assetConfig.value && assetConfig.value?.chain_name != dexChain) {
          const invPrimaryChannel =
            store.getters['demeris/getPrimaryChannel']({
              chain_name: dexChain,
              destination_chain_name: assetConfig.value.chain_name,
            }) ??
            (await store.dispatch(
              'demeris/GET_PRIMARY_CHANNEL',
              {
                subscribe: true,
                params: { chain_name: dexChain, destination_chain_name: assetConfig.value.chain_name },
              },
              { root: true },
            ));

          poolDenom.value = generateDenomHash(invPrimaryChannel, denom.value);
        }

        displayName.value = await getDisplayName(denom.value, dexChain);
      },
      { immediate: true },
    );

    const poolsWithAsset = computed(() => filterPoolsByDenom(poolDenom.value));

    const availableAmount = computed(() => {
      return assets.value.reduce((acc, item) => acc + parseInt(parseCoins(item.amount)[0].amount), 0);
    });

    const stakingBalance = computed(() => {
      // TODO: This needs fixing for a chain that supports MULTIPLE stakeable assets (if any ever exist)
      if (assetConfig.value && assetConfig.value.chain_name && assetConfig.value.stakable) {
        return stakingBalancesByChain(assetConfig.value.chain_name);
      }
      return 0;
    });

    const stakedAmount = computed(() => {
      let staked = stakingBalance.value;
      let totalStakedAmount = 0;
      if (Array.isArray(staked)) {
        for (let i = 0; i < staked.length; i++) {
          let amount = parseFloat(staked[i].amount);
          if (amount) {
            totalStakedAmount += amount;
          }
        }
      }
      return totalStakedAmount;
    });

    const poolsInvestedWithAsset = computed(() => {
      const poolsCopy = JSON.parse(JSON.stringify(poolsWithAsset.value));
      const balancesCopy = JSON.parse(JSON.stringify(balances.value));

      return poolsCopy.filter((item) =>
        balancesCopy.some(
          (item2) => item.pool_coin_denom == item2.base_denom && +parseCoins(item2.amount)[0].amount > 0,
        ),
      );
    });

    const poolsNotInvestedWithAsset = computed(() => {
      const poolsCopy = JSON.parse(JSON.stringify(poolsWithAsset.value));
      const balancesCopy = JSON.parse(JSON.stringify(balances.value));

      return poolsCopy.filter(
        (item) =>
          !balancesCopy.some((item2) => item.pool_coin_denom == item2.base_denom) ||
          balancesCopy.some(
            (item2) => item.pool_coin_denom == item2.base_denom && +parseCoins(item2.amount)[0].amount == 0,
          ),
      );
    });

    const poolsDisplay = computed(() => {
      const fillBy = 3 - poolsInvestedWithAsset.value.length;

      if (fillBy > 0) {
        return poolsInvestedWithAsset.value.concat(poolsNotInvestedWithAsset.value.slice(0, fillBy));
      }

      return poolsInvestedWithAsset.value;
    });

    const pooledAmount = computed(() => {
      let assetPooledAmount = 0;

      for (const pool of poolsInvestedWithAsset.value) {
        const poolCoinBalances = balancesByDenom(pool.pool_coin_denom);
        const withdrawBalances = getWithdrawBalances(
          pool,
          poolCoinBalances.reduce((acc, item) => acc + +parseCoins(item.amount)[0].amount, 0),
        );

        const assetBalanceInPool = withdrawBalances.find((x) => x.denom == poolDenom.value);
        if (assetBalanceInPool) {
          assetPooledAmount += assetBalanceInPool.amount;
        }
      }

      return assetPooledAmount;
    });

    const totalAmount = computed(() => {
      return availableAmount.value + stakedAmount.value;
    });

    return {
      nativeAsset,
      assetConfig,
      denom,
      assets,
      poolsDisplay,
      poolsInvestedWithAsset,
      availableAmount,
      stakedAmount,
      pooledAmount,
      totalAmount,
      isPoolCoin,
    };
  },
});
</script>

<style lang="scss" scoped></style>
