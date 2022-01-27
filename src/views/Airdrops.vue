<template>
  <AppLayout>
    <div class="md:flex justify-between">
      <div class="flex flex-col md:col-span-5 lg:col-span-5 w-full max-w-3xl lg:pr-px mb-16 md:mb-0">
        <header>
          <div class="text-2 sm:text-3 lg:text-4 font-bold mt-1 md:mt-2">Airdrops</div>
        </header>
        <section class="mt-12">
          <AirdropsTable :airdrops="airdrops" :show-headers="false" :limit-rows="10" @row-click="openAirdropPage" />
        </section>
      </div>

      <aside class="flex flex-col mx-auto md:ml-8 lg:ml-12 md:mr-0 max-w-xs">
        <SkeletonLoader width="100%" height="320px" />
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
import { useStore } from 'vuex';

import AirdropsInfo from '@/components/airdrops/AirdropsInfo';
import AirdropsTable from '@/components/airdrops/AirdropsTable';
import SkeletonLoader from '@/components/common/loaders/SkeletonLoader.vue';
import airdropsData from '@/data/sampleAirdrops';
import AppLayout from '@/layouts/AppLayout.vue';
import { GlobalDemerisActionTypes, TypedAPIStore } from '@/store';
import { Airdrop } from '@/types/api';
import { pageview } from '@/utils/analytics';

export default {
  name: 'Airdrops',
  components: {
    AppLayout,
    SkeletonLoader,
    AirdropsTable,
    AirdropsInfo,
  },

  setup() {
    const apistore = useStore() as TypedAPIStore;
    const { t } = useI18n({ useScope: 'global' });
    pageview({ page_title: 'Airdrops', page_path: '/' });
    useMeta(
      computed(() => ({
        title: t('navbar.airdrops'),
      })),
    );

    const router = useRouter();
    const airdrops = airdropsData.sampleAirdrops;

    const openAirdropPage = (airdrop: Airdrop) => {
      router.push({ name: 'Airdrop', params: { airdrop: airdrop.tokenTicker } });
      apistore.dispatch(GlobalDemerisActionTypes.API.GET_SELECTED_AIRDROP, {
        params: {
          airdrop,
        },
      });
    };

    return { airdrops, openAirdropPage };
  },
};
</script>
