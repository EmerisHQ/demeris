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

export default {
  emits: ['active-filter'],
  setup(_, { emit }) {
    const activeFilterItem = ref('all');
    const filtersItems = [
      {
        text: 'All airdrops',
        value: 'all',
      },
      {
        text: 'My airdrops',
        value: 'mine',
      },
      {
        text: 'Upcoming',
        value: 'upcoming',
      },
      {
        text: 'Live',
        value: 'live',
      },
      {
        text: 'Past',
        value: 'past',
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
