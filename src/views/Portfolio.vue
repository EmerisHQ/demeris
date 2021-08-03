<template>
  <AppLayout>
    <div class="md:flex justify-between">
      <div class="flex flex-col md:col-span-5 lg:col-span-5 w-full max-w-3xl mb-16">
        <header>
          <div class="-text-1 md:text-0 text-muted">{{ $t('context.assets.totalBalance') }}</div>
          <div class="text-2 sm:text-3 md:text-4 lg:text-5 font-bold mt-1 md:mt-2">
            <TotalPrice :balances="balances" small-decimals />
          </div>
        </header>
        <section class="mt-16">
          <header class="flex justify-between items-center mb-6">
            <h2 class="text-2 font-bold">{{ $t('context.assets.title') }}</h2>
            <router-link
              v-if="!balances.length"
              class="portfolio__assets__header__link flex items-center font-medium"
              to="/assets"
            >
              {{ $t('generic_cta.seeall') }} &rarr;
            </router-link>
          </header>

          <AssetsTable
            :balances="balances"
            :hide-zero-assets="true"
            variant="balance"
            :show-headers="false"
            :limit-rows="4"
            @row-click="openAssetPage"
          />

          <MoonpayBanner v-if="!balances.length" title="Add crypto to your account" class="mt-6" size="large" />
        </section>
        <section class="mt-16">
          <header class="flex justify-between items-center mb-6">
            <h2 class="text-2 font-bold">{{ $t('context.pools.title') }}</h2>
            <router-link
              v-if="poolsInvested.length"
              class="portfolio__pools__header__link flex items-center font-medium"
              to="/pools"
            >
              {{ $t('generic_cta.discoverMore') }} <ArrowRightIcon class="ml-3" />
            </router-link>
          </header>

          <div v-if="poolsInvested.length">
            <Pools :pools="poolsInvested" />
          </div>

          <div v-else class="p-8 w-full flex flex-col items-center justify-center">
            <p class="text-muted">{{ $t('context.pools.empty') }}</p>
            <Button variant="secondary" class="mt-6" :name="$t('context.pools.explore')" @click="openPoolsPage" />
          </div>
        </section>
      </div>

      <aside class="flex flex-col mx-auto md:ml-8 lg:ml-12 md:mr-0 items-end max-w-xs">
        <LiquiditySwap />
        <Intro class="mt-4" />
      </aside>
    </div>
  </AppLayout>
</template>

<script lang="ts">
import { computed } from '@vue/runtime-core';
import { useRouter } from 'vue-router';

import AssetsTable from '@/components/assets/AssetsTable';
import ArrowRightIcon from '@/components/common/Icons/ArrowRightIcon.vue';
import Intro from '@/components/common/Intro.vue';
import MoonpayBanner from '@/components/common/MoonpayBanner.vue';
import TotalPrice from '@/components/common/TotalPrice.vue';
import Pools from '@/components/liquidity/Pools.vue';
import LiquiditySwap from '@/components/liquidity/Swap.vue';
import Button from '@/components/ui/Button.vue';
import useAccount from '@/composables/useAccount';
import usePools from '@/composables/usePools';
import AppLayout from '@/layouts/AppLayout.vue';

export default {
  name: 'Portfolio',
  components: {
    AppLayout,
    Button,
    MoonpayBanner,
    LiquiditySwap,
    TotalPrice,
    AssetsTable,
    ArrowRightIcon,
    Pools,
    Intro,
  },

  setup() {
    const router = useRouter();
    const { balances } = useAccount();
    const { pools } = usePools();

    const openAssetPage = (asset: Record<string, string>) => {
      router.push({ name: 'Asset', params: { denom: asset.denom } });
    };

    const openPoolsPage = () => {
      router.push({ name: 'Pools' });
    };

    const poolsInvested = computed(() => {
      const poolsCopy = JSON.parse(JSON.stringify(pools.value));
      return poolsCopy.filter((item) => balances.value.some((item2) => item.pool_coin_denom == item2.base_denom));
    });

    return { balances, poolsInvested, openAssetPage, openPoolsPage };
  },
};
</script>

<style lang="scss" scoped></style>
