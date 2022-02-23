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
    <a @click="setActiveFilter(item)">
      {{ item.text }}
      <span
        v-if="item.value === activeFilterItem && activeFilterItem === 'mine'"
        class="ml-2 bg-brand py-1 px-2 rounded-full -text-1 font-medium text-text"
      >
        3
      </span>
    </a>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

export default {
  emits: ['active-filter'],
  setup(_, { emit }) {
    const { t } = useI18n({ useScope: 'global' });

    const activeFilterItem = ref('all');
    const filtersItems = [
      {
        text: t('context.airdrops.airdropstableFilterItems.all.text'),
        value: t('context.airdrops.airdropstableFilterItems.all.value'),
      },
      {
        text: t('context.airdrops.airdropstableFilterItems.mine.text'),
        value: t('context.airdrops.airdropstableFilterItems.mine.value'),
      },
      {
        text: t('context.airdrops.airdropstableFilterItems.upcoming.text'),
        value: t('context.airdrops.airdropstableFilterItems.upcoming.value'),
      },
      {
        text: t('context.airdrops.airdropstableFilterItems.live.text'),
        value: t('context.airdrops.airdropstableFilterItems.live.value'),
      },
      {
        text: t('context.airdrops.airdropstableFilterItems.past.text'),
        value: t('context.airdrops.airdropstableFilterItems.past.value'),
      },
    ];

    const setActiveFilter = (item: any) => {
      activeFilterItem.value = item.value;
      emit('active-filter', activeFilterItem.value);
    };

    return { filtersItems, setActiveFilter, activeFilterItem };
  },
};
</script>
