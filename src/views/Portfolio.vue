<template>
  <AppLayout>
    <div class="md:flex justify-between">
      <div class="flex flex-col md:col-span-5 lg:col-span-5 w-full max-w-3xl lg:pr-px mb-16 md:mb-0">
        <header>
          <div class="-text-1 md:text-0 text-muted">{{ $t('context.assets.totalBalance') }}</div>
          <div class="text-2 sm:text-3 md:text-4 lg:text-5 font-bold mt-1 md:mt-2">
            <TotalPrice v-if="initialLoadComplete" :balances="balances" small-decimals />
            <SkeletonLoader v-else width="100%" />
          </div>
        </header>
        <section class="mt-16">
          <header class="flex justify-between items-center mb-6">
            <h2 class="text-2 font-bold">{{ $t('context.assets.title') }}</h2>
            <router-link v-if="!balances.length" class="font-medium" to="/assets">
              {{ $t('generic_cta.seeall') }} &rarr;
            </router-link>
          </header>
          <template v-if="initialLoadComplete">
            <AssetsTable
              :balances="balances"
              :hide-zero-assets="true"
              variant="balance"
              :show-headers="false"
              :limit-rows="4"
              @row-click="openAssetPage"
            />
          </template>
          <SkeletonLoader v-else width="100%" height="300px" />
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

      <aside class="flex flex-col mx-auto md:ml-8 lg:ml-12 md:mr-0 items-end max-w-xs">
        <LiquiditySwap />
        <!-- TODO: remove, placed here for testing -->
        <Toast
          :messages="testData"
          @undo-function="($event) => undo($event)"
          @details-function="($event) => details($event)"
          @on-update="($event) => (testData = $event)"
        />
        <button @click="addone()">add one</button>
        <Intro class="mt-4" />
      </aside>
    </div>
  </AppLayout>
</template>

<script lang="ts">
import { computed, ref } from '@vue/runtime-core';
import { useI18n } from 'vue-i18n';
import { useMeta } from 'vue-meta';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

import AssetsTable from '@/components/assets/AssetsTable';
import BuyCryptoBanner from '@/components/common/BuyCryptoBanner.vue';
import Intro from '@/components/common/Intro.vue';
import SkeletonLoader from '@/components/common/loaders/SkeletonLoader.vue';
import TotalPrice from '@/components/common/TotalPrice.vue';
import Pools from '@/components/liquidity/Pools.vue';
import LiquiditySwap from '@/components/liquidity/Swap.vue';
import Button from '@/components/ui/Button.vue';
import Toast from '@/components/ui/Toast/Toast.vue';
import useAccount from '@/composables/useAccount';
import usePools from '@/composables/usePools';
import AppLayout from '@/layouts/AppLayout.vue';
import { GlobalDemerisGetterTypes } from '@/store';
import { pageview } from '@/utils/analytics';
import { featureRunning } from '@/utils/FeatureManager';

export default {
  name: 'Portfolio',
  components: {
    AppLayout,
    Button,
    BuyCryptoBanner,
    LiquiditySwap,
    TotalPrice,
    AssetsTable,
    Pools,
    Toast,
    Intro,
    SkeletonLoader,
  },

  setup() {
    const { t } = useI18n({ useScope: 'global' });
    pageview({ page_title: 'Portfolio', page_path: '/' });
    useMeta(
      computed(() => ({
        title: t('navbar.portfolio'),
      })),
    );

    const router = useRouter();
    const { balances } = useAccount();
    const { pools } = usePools();

    const store = useStore();
    const openAssetPage = (asset: Record<string, string>) => {
      router.push({ name: 'Asset', params: { denom: asset.denom } });
    };

    const openPoolsPage = () => {
      router.push({ name: 'Pools' });
    };

    const initialLoadComplete = computed(() => {
      if (featureRunning('REQUEST_PARALLELIZATION')) {
        return !store.getters[GlobalDemerisGetterTypes.USER.getFirstLoad];
      } else {
        return true;
      }
    });
    const poolsInvested = computed(() => {
      const poolsCopy = pools.value?.slice() ?? [];
      return poolsCopy.filter((item) => balances.value.some((item2) => item.pool_coin_denom == item2.base_denom));
    });
    // TODO: remove, here for testing only
    const testData = ref([]);
    let i = 0;
    for (i = 0; i < 3; i++) {
      testData.value.push({ message: `Transaction item ${i}`, action: '', date: '', id: i });
    }
    function undo(id) {
      console.log('undo id', id);
    }
    function details(id) {
      console.log('details id', id);
    }
    function addone() {
      i++;
      testData.value.push({ message: `Transaction item ${i}`, action: '', date: '', id: i });
      console.log(testData.value.length);
    }

    return { balances, poolsInvested, openAssetPage, openPoolsPage, initialLoadComplete, testData, undo, details, addone };
    
  },
};
</script>
<style lang="scss" scoped>
::v-deep(.skeleton-loader) {
  margin-top: 0;
}
</style>
