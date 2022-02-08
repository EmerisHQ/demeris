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
        <AirdropClaimablePanel class="mb-6" />
        <!-- Quick Info -->
        <div class="mb-8 flex items-start text-muted border border-border rounded-xl p-4">
          <WarningCircleIcon class="mr-2" />
          <p class="-text-1">
            Airdrop is not financial advice. Eligibility, claim action can change based on the project.
          </p>
        </div>
        <AirdropsInfo />
      </aside>
    </div>
  </AppLayout>
</template>

<script lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMeta } from 'vue-meta';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

import AirdropClaimablePanel from '@/components/airdrops/AirdropClaim/AirdropClaimablePanel.vue';
import AirdropsInfo from '@/components/airdrops/AirdropsInfo';
import AirdropsTable from '@/components/airdrops/AirdropsTable';
import WarningCircleIcon from '@/components/common/Icons/WarningCircleIcon.vue';
import airdropsData from '@/data/sampleAirdrops';
import AppLayout from '@/layouts/AppLayout.vue';
import { GlobalDemerisActionTypes, TypedAPIStore } from '@/store';
import { Airdrop } from '@/types/api';
import { pageview } from '@/utils/analytics';

export default {
  name: 'Airdrops',
  components: {
    AppLayout,
    AirdropClaimablePanel,
    AirdropsTable,
    AirdropsInfo,
    WarningCircleIcon,
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

    // onMounted(() => {
    //   require
    //     .context('../components/', true, /\.vue$/)
    //     .keys()
    //     .forEach((r) => console.log('checking here', r));
    // });

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
