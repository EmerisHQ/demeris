<template>
  <header class="flex justify-between items-center">
    <div class="text-2 sm:text-3 lg:text-4 font-bold mt-1 md:mt-2">
      {{ $t(`context.airdrops.filterItems.${activeFilter}`) }}
      <span class="lowercase">{{ $t('context.airdrops.title') }}</span>
    </div>
    <div class="w-1/4">
      <Search v-model:keyword="keyword" placeholder="Search airdrops" class="pools__search max-w-xs w-full" />
    </div>
  </header>
  <AirdropClaimablePanel v-if="!keyword" :active-filter="activeFilter" class="mb-6" />
  <section class="mt-4">
    <AirdropsTable
      :airdrops="filteredAirdrops"
      :active-filter="activeFilter"
      :keyword="keyword"
      :show-headers="false"
      :limit-rows="10"
      @row-click="openAirdropPage"
    />
  </section>
</template>

<script lang="ts">
import { EmerisAirdrops } from '@emeris/types';
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import AirdropClaimablePanel from '@/components/airdrops/AirdropClaim/AirdropClaimablePanel.vue';
import AirdropsTable from '@/components/airdrops/AirdropsTable';
import Search from '@/components/common/Search.vue';
import { GlobalGetterTypes } from '@/store';
import { typedstore } from '@/store/setup';

export default {
  components: {
    AirdropClaimablePanel,
    AirdropsTable,
    Search,
  },

  props: {
    activeFilter: {
      type: String,
      default: '',
    },
  },

  setup(props) {
    const keyword = ref('');
    const router = useRouter();

    const sortAirdropstable = (x, y) => {
      return x.project.localeCompare(y.project);
    };

    const airdrops = computed(() => {
      return typedstore.getters[GlobalGetterTypes.API.getAirdrops].sort(sortAirdropstable);
    });

    const filteredAirdrops = computed(() => {
      const filtered = airdrops?.value?.filter((airdrop) => {
        return airdrop?.project?.toLowerCase().indexOf(keyword.value.toLowerCase()) !== -1;
      });
      return filtered;
    });

    const openAirdropPage = (airdrop: EmerisAirdrops.Airdrop) => {
      router.push({ name: 'Airdrop', params: { airdrop: airdrop.tokenTicker } });
    };

    const isDemoAccount = computed(() => {
      return (
        !typedstore.getters[GlobalGetterTypes.USER.isSignedIn] ||
        typedstore.getters[GlobalGetterTypes.USER.isDemoAccount]
      );
    });

    watch(
      () => props.activeFilter,
      () => {
        keyword.value = '';
      },
      { immediate: true },
    );

    return {
      airdrops,
      filteredAirdrops,
      openAirdropPage,
      keyword,
      isDemoAccount,
    };
  },
};
</script>
