<template>
  <!-- Filter Area -->
  <div
    v-for="(item, index) in filtersItems"
    :key="index"
    class="my-6 cursor-pointer flex items-center"
    :class="{
      'text-text font-medium': item.value === activeFilterItem,
      'text-muted hover:text-text': item.value !== activeFilterItem,
    }"
  >
    <a class="flex items-center" @click="setActiveFilter(item.value)">
      {{ item.text }}
      <span v-if="item.value === activeFilterItem && airdropsLoading">
        <Icon name="LoadingIcon" :icon-size="0.8" class="ml-2" />
      </span>
      <span
        v-if="item.value === activeFilterItem && activeFilterItem === 'mine'"
        class="ml-2 bg-negative py-1 px-2 rounded-full -text-1 font-medium"
        style="color: white"
      >
        {{ noOfClaimableAirdrops }}
      </span>
    </a>
  </div>
</template>

<script lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import Icon from '@/components/ui/Icon.vue';
import { GlobalDemerisGetterTypes } from '@/store';
import { apistore } from '@/store/setup';
import { LoadingState } from '@/types/api';

export default {
  components: {
    Icon,
  },
  emits: ['active-filter'],
  setup(_, { emit }) {
    const { t } = useI18n({ useScope: 'global' });

    const activeFilterItem = ref('all');
    const filtersItems = [
      {
        text: `${t('context.airdrops.airdropsFilterItems.all')} ${t('context.airdrops.title').toLowerCase()}`,
        value: 'all',
      },
      {
        text: `${t('context.airdrops.airdropsFilterItems.mine')} ${t('context.airdrops.title').toLowerCase()}`,
        value: 'mine',
      },
      {
        text: t('context.airdrops.airdropsFilterItems.upcoming'),
        value: 'upcoming',
      },
      {
        text: t('context.airdrops.airdropsFilterItems.live'),
        value: 'live',
      },
      {
        text: t('context.airdrops.airdropsFilterItems.past'),
        value: 'past',
      },
    ];

    onMounted(() => {
      setActiveFilter(activeFilterItem.value);
    });

    const setActiveFilter = (activeItem: string) => {
      activeFilterItem.value = activeItem;
      emit('active-filter', activeFilterItem.value);
    };

    const airdrops = computed(() => {
      return apistore.getters[GlobalDemerisGetterTypes.API.getAirdrops];
    });

    const airdropsLoading = computed(() => {
      return apistore.getters[GlobalDemerisGetterTypes.API.getAirdropsStatus] === LoadingState.LOADING;
    });

    const noOfClaimableAirdrops = computed(() => {
      const claimableAirdrops = airdrops.value.filter((item) => item.eligibility === 'CLAIMABLE');
      return claimableAirdrops.length;
    });

    return { filtersItems, setActiveFilter, activeFilterItem, airdropsLoading, noOfClaimableAirdrops };
  },
};
</script>
