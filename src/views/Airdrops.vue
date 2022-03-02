<template>
  <AppLayout>
    <div class="md:flex justify-between">
      <aside class="w-3/12">
        <AirdropsFilter />
        <AirdropsInfo />

        <!-- Quick Info -->
        <div class="mt-12 text-muted -text-1">
          <p class="mb-4">
            {{ $t('context.airdrops.airdropContentDisclaimer') }}
          </p>
          <p class="text-text font-medium">{{ $t('context.airdrops.featureProjects') }}</p>
        </div>
      </aside>

      <div class="w-9/12 max-w-3xl mb-16 md:mb-0">
        <header class="flex justify-between items-center">
          <div class="text-2 sm:text-3 lg:text-4 font-bold mt-1 md:mt-2">
            {{ $t('context.airdrops.allAirdrops') }}
          </div>
          <div class="w-1/4">
            <Search v-model:keyword="keyword" placeholder="Search airdrops" class="pools__search max-w-xs w-full" />
          </div>
        </header>
        <AirdropClaimablePanel :active-filter="activeFilter" class="mb-6" />
        <section class="mt-12">
          <AirdropsTable
            :airdrops="airdrops"
            :show-headers="false"
            :limit-rows="10"
            @row-click="openAirdropPage"
            @active-filter="setActiveFilter"
          />
        </section>
      </div>
    </div>
  </AppLayout>
</template>

<script lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMeta } from 'vue-meta';
import { useRouter } from 'vue-router';

import AirdropClaimablePanel from '@/components/airdrops/AirdropClaim/AirdropClaimablePanel.vue';
import AirdropsFilter from '@/components/airdrops/AirdropsFilter';
import AirdropsInfo from '@/components/airdrops/AirdropsInfo';
import AirdropsTable from '@/components/airdrops/AirdropsTable';
import Search from '@/components/common/Search.vue';
import AppLayout from '@/layouts/AppLayout.vue';
import { GlobalDemerisActionTypes, GlobalDemerisGetterTypes } from '@/store';
import { apistore } from '@/store/setup';
import { Airdrop } from '@/types/api';
import { pageview } from '@/utils/analytics';

export default {
  name: 'Airdrops',
  components: {
    AppLayout,
    AirdropClaimablePanel,
    AirdropsTable,
    AirdropsInfo,
    AirdropsFilter,
    Search,
  },

  setup() {
    const { t } = useI18n({ useScope: 'global' });
    pageview({ page_title: 'Airdrops', page_path: '/' });
    useMeta(
      computed(() => ({
        title: t('navbar.airdrops'),
      })),
    );

    const activeFilter = ref('');
    let gitAirdropsList = ref([]);

    const setActiveFilter = (value: string) => {
      activeFilter.value = value;
    };

    const router = useRouter();

    const getAllAirdrops = async () => {
      gitAirdropsList.value = await apistore.dispatch(GlobalDemerisActionTypes.API.GET_GIT_AIRDROPS_LIST, {
        subscribe: false,
      });

      gitAirdropsList.value.forEach((item) => {
        apistore.dispatch(GlobalDemerisActionTypes.API.GET_AIRDROPS, {
          subscribe: false,
          params: {
            airdropFileName: item.name,
          },
        });
      });
    };

    onMounted(() => {
      getAllAirdrops();
    });

    const airdrops = computed(() => {
      return apistore.getters[GlobalDemerisGetterTypes.API.getAirdrops];
    });

    const openAirdropPage = (airdrop: Airdrop) => {
      router.push({ name: 'Airdrop', params: { airdrop: airdrop.tokenTicker } });
      apistore.dispatch(GlobalDemerisActionTypes.API.SET_SELECTED_AIRDROP, {
        params: {
          airdrop,
        },
      });
    };

    return { airdrops, openAirdropPage, activeFilter, setActiveFilter };
  },
};
</script>
