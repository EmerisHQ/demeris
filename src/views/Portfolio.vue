<template>
  <AppLayout>
    <div class="md:flex justify-between">
      <div class="flex flex-col md:col-span-5 lg:col-span-5 w-full max-w-3xl lg:pr-px mb-16 md:mb-0">
        <header>
          <div class="-text-1 md:text-0 text-muted">{{ $t('context.assets.totalBalance') }}</div>
          <div class="text-2 sm:text-3 md:text-4 lg:text-5 font-bold mt-1 md:mt-2">
            <TotalPrice v-if="initialLoadComplete" small-decimals />
            <SkeletonLoader v-else width="100%" />
          </div>
        </header>
        <section class="mt-16">
          <header v-if="!featureRunning('STAKING_PORTFOLIO')" class="flex justify-between items-center mb-6 mt-6">
            <h2 class="text-2 font-bold">{{ $t('context.assets.title') }}</h2>
            <router-link class="font-medium" to="/assets"> {{ $t('generic_cta.seeall') }} &rarr; </router-link>
          </header>
          <template v-if="initialLoadComplete">
            <FeatureRunningConditional name="STAKING_PORTFOLIO">
              <AssetsFilter
                class="mb-8"
                :assets-length="assetsLength"
                :assets-staking-length="assetsStakingLength"
                :asset-filter-selected="activeFilter"
                @active-filter="(value) => (activeFilter = value)"
              />
            </FeatureRunningConditional>
            <AssetsTable
              v-show="!featureRunning('STAKING_PORTFOLIO') || activeFilter === 'all'"
              :balances="balances"
              :hide-zero-assets="true"
              variant="balance"
              :show-available-asset="true"
              :limit-rows="4"
              @row-click="openAssetPage"
            />
            <FeatureRunningConditional name="STAKING_PORTFOLIO">
              <StakeTableBanner v-show="activeFilter === 'staking' && assetsStakingLength === 0" />
              <StakingTable
                v-show="activeFilter === 'staking' && assetsStakingLength > 0"
                show-headers
                @row-click="openAssetPage"
              />
            </FeatureRunningConditional>
          </template>
          <SkeletonLoader v-else width="100%" height="300px" class="mb-3" />
          <BuyCryptoBanner v-if="!balances.length" size="large" />
        </section>
        <section class="mt-16">
          <header class="flex justify-between items-center mb-6">
            <h2 class="text-2 font-bold">{{ $t('context.pools.title') }}</h2>
          </header>

          <template v-if="initialLoadComplete">
            <div v-if="poolsInvested.length">
              <Pools :pools="poolsInvested" />
            </div>

            <div v-else class="p-8 w-full flex flex-col items-center justify-center">
              <p class="text-muted">{{ $t('context.pools.empty') }}</p>
              <Button variant="secondary" class="mt-6" :name="$t('context.pools.explore')" @click="openPoolsPage" />
            </div>
          </template>
          <SkeletonLoader v-else width="100%" height="300px" />
        </section>
      </div>

      <aside class="md:ml-8 lg:ml-12 md:mr-0 max-w-xs">
        <Swap />
        <Intro class="mt-4" />
        <FeatureRunningConditional v-if="!featureRunning('STAKING_PORTFOLIO')" name="STAKING">
          <PortfolioStakingBanner :balances="balances" class="mt-4" />
        </FeatureRunningConditional>
      </aside>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed } from '@vue/runtime-core';
import groupBy from 'lodash.groupby';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMeta } from 'vue-meta';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

import StakeTableBanner from '@/components/asset/StakeTableBanner.vue';
import AssetsFilter from '@/components/assets/AssetsFilter';
import AssetsTable from '@/components/assets/AssetsTable';
import PortfolioStakingBanner from '@/components/banners/PortfolioStakingBanner.vue';
import BuyCryptoBanner from '@/components/common/BuyCryptoBanner.vue';
import FeatureRunningConditional from '@/components/common/FeatureRunningConditional.vue';
import Intro from '@/components/common/Intro.vue';
import SkeletonLoader from '@/components/common/loaders/SkeletonLoader.vue';
import TotalPrice from '@/components/common/TotalPrice.vue';
import Pools from '@/components/liquidity/Pools.vue';
import StakingTable from '@/components/stake/StakingTable/StakingTable.vue';
import Swap from '@/components/swap/Swap.vue';
import Button from '@/components/ui/Button.vue';
import useAccount from '@/composables/useAccount';
import usePools from '@/composables/usePools';
import AppLayout from '@/layouts/AppLayout.vue';
import { GlobalGetterTypes } from '@/store';
import { pageview } from '@/utils/analytics';
import { featureRunning } from '@/utils/FeatureManager';

const { t } = useI18n({ useScope: 'global' });
pageview({ page_title: 'Portfolio', page_path: '/' });
useMeta(
  computed(() => ({
    title: t('navbar.portfolio'),
  })),
);

const router = useRouter();
const { balances, stakingBalances } = useAccount();
const { pools } = usePools();

const store = useStore();

const activeFilter = ref('all');

const openAssetPage = (asset: Record<string, string>) => {
  router.push({ name: 'Asset', params: { denom: asset.denom } });
};

const openPoolsPage = () => {
  router.push({ name: 'Pools' });
};

const initialLoadComplete = computed(() => {
  return !store.getters[GlobalGetterTypes.USER.getFirstLoad];
});

const assetsLength = computed(() => {
  return Object.keys(groupBy(balances.value, 'base_denom')).length;
});

const assetsStakingLength = computed(() => {
  return Object.keys(groupBy(stakingBalances.value, 'chain_name')).length;
});

const poolsInvested = computed(() => {
  const poolsCopy = pools.value?.slice() ?? [];
  return poolsCopy.filter((item) => balances.value.some((item2) => item.pool_coin_denom == item2.base_denom));
});
</script>

<style lang="scss" scoped>
:deep(.skeleton-loader) {
  margin-top: 0;
}
</style>
