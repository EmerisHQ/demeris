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
    <a @click="setActiveFilter(item.value)">
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
import { defineComponent, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  emits: ['active-filter'],
  setup(_, { emit }) {
    const { t } = useI18n({ useScope: 'global' });

    const activeFilterItem = ref('all');
    const filtersItems = [
      {
        text: t('context.airdrops.airdropstableFilterItems.all'),
        value: 'all',
      },
      {
        text: t('context.airdrops.airdropstableFilterItems.mine'),
        value: 'mine',
      },
      {
        text: t('context.airdrops.airdropstableFilterItems.upcoming'),
        value: 'upcoming',
      },
      {
        text: t('context.airdrops.airdropstableFilterItems.live'),
        value: 'live',
      },
      {
        text: t('context.airdrops.airdropstableFilterItems.past'),
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

    return { filtersItems, setActiveFilter, activeFilterItem };
  },
});
</script>
