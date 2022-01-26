<template>
  <AppLayout>
    <div class="md:flex justify-between">
      <div class="flex flex-col md:col-span-5 lg:col-span-5 w-full max-w-3xl lg:pr-px mb-16 md:mb-0">
        <header>
          <div class="text-2 sm:text-3 lg:text-4 font-bold mt-1 md:mt-2">Airdrops</div>
        </header>
        <section class="mt-12">
          <AirdropsTable :airdrops="airdrops" :show-headers="false" :limit-rows="10" @row-click="openAssetPage" />
        </section>
      </div>

      <aside class="flex flex-col mx-auto md:ml-8 lg:ml-12 md:mr-0 max-w-xs">
        <LiquiditySwap />
        <AirdropsInfo class="mt-8" />
      </aside>
    </div>
  </AppLayout>
</template>

<script lang="ts">
import { computed } from '@vue/runtime-core';
import { useI18n } from 'vue-i18n';
import { useMeta } from 'vue-meta';
import { useRouter } from 'vue-router';

import AirdropsInfo from '@/components/airdrops/AirdropsInfo';
import AirdropsTable from '@/components/airdrops/AirdropsTable';
import LiquiditySwap from '@/components/liquidity/Swap.vue';
import airdropsData from '@/data/sampleAirdrops';
import AppLayout from '@/layouts/AppLayout.vue';
import { pageview } from '@/utils/analytics';
import { featureRunning } from '@/utils/FeatureManager';

export default {
  name: 'Airdrops',
  components: {
    AppLayout,
    LiquiditySwap,
    AirdropsTable,
    AirdropsInfo,
  },

  setup() {
    const { t } = useI18n({ useScope: 'global' });
    pageview({ page_title: 'Airdrops', page_path: '/' });
    useMeta(
      computed(() => ({
        title: t('navbar.airdrops'),
      })),
    );

    if (featureRunning('TEST_SHOW_CONSOLE_LOG')) {
      console.log('Feature: TEST_SHOW_CONSOLE_LOG is running');
    }

    const router = useRouter();
    const airdrops = airdropsData.sampleAirdrops;

    const openAssetPage = (asset: Record<string, string>) => {
      router.push({ name: 'Asset', params: { denom: asset.denom } });
    };

    return { airdrops, openAssetPage };
  },
};
</script>
