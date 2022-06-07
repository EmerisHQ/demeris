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
    <a class="flex items-center" @click="() => (activeFilterItem = item.value)">
      {{ item.text }}
      <span v-if="showAirdropsLoading(item.value)">
        <Icon name="LoadingIcon" :icon-size="0.8" class="ml-2" />
      </span>
      <span
        v-if="showNoOfClaimableAirdrops(item.value)"
        class="ml-2 bg-negative py-1 px-2 rounded-full -text-1 font-medium text-white"
      >
        {{ noOfClaimableAirdrops }}
      </span>
    </a>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';

import Icon from '@/components/ui/Icon.vue';
import { GlobalGetterTypes, RootStoreTyped } from '@/store';
import { LoadingState } from '@/types/util';
import { AirdropEligibilityStatus } from '@/utils/airdropEligibility';

const emit = defineEmits<{
  (e: 'active-filter', newFilter: any): void;
}>();

const { t } = useI18n({ useScope: 'global' });
const typedstore = useStore() as RootStoreTyped;
const activeFilterItem = ref('all');
const filtersItems = [
  {
    text: `${t('context.airdrops.filterItems.all')} ${t('context.airdrops.title').toLowerCase()}`,
    value: 'all',
  },
  {
    text: `${t('context.airdrops.filterItems.mine')} ${t('context.airdrops.title').toLowerCase()}`,
    value: 'mine',
  },
  {
    text: t('context.airdrops.filterItems.upcoming'),
    value: 'upcoming',
  },
  {
    text: t('context.airdrops.filterItems.live'),
    value: 'live',
  },
  {
    text: t('context.airdrops.filterItems.past'),
    value: 'past',
  },
];

watch(
  () => activeFilterItem.value,
  (newFilterItem) => {
    emit('active-filter', newFilterItem);
  },
);

const airdrops = computed(() => {
  return typedstore.getters[GlobalGetterTypes.API.getAirdrops];
});

const airdropsLoading = computed(() => {
  return typedstore.getters[GlobalGetterTypes.API.getAirdropsStatus] === LoadingState.LOADING;
});

const noOfClaimableAirdrops = computed(() => {
  const claimableAirdrops = airdrops.value.filter((item) => item.eligibility === AirdropEligibilityStatus.CLAIMABLE);
  return claimableAirdrops.length;
});

const isDemoAccount = computed(() => {
  return (
    !typedstore.getters[GlobalGetterTypes.USER.isSignedIn] || typedstore.getters[GlobalGetterTypes.USER.isDemoAccount]
  );
});

const showAirdropsLoading = (filterItem: string) => {
  return filterItem === activeFilterItem.value && airdropsLoading.value;
};

const showNoOfClaimableAirdrops = (filterItem: string) => {
  return filterItem === activeFilterItem.value && activeFilterItem.value === 'mine' && !isDemoAccount.value;
};
</script>
