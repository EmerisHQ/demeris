<template>
  <div role="menu" class="-mx-6 flex-1 flex flex-col">
    <template v-if="!results.length && search">
      <div class="flex-1 flex flex-col items-center justify-center">
        <p class="font-medium text-1">No results for '{{ search }}'</p>
        <p class="text-muted">Try again with another search</p>
      </div>
    </template>

    <template v-else>
      <button
        v-for="item of results"
        :key="item"
        role="menuitem"
        class="py-4 px-6 hover:bg-fg transition-colors duration-300 flex items-center justify-between"
        @click="$emit('select', item)"
      >
        <div class="flex items-center space-x-3">
          <div><slot name="symbol" :item="item" /></div>
          <div class="flex flex-col items-start">
            <p class="font-medium"><slot name="title" :item="item" /></p>
            <p class="-text-1 font-normal text-muted"><slot name="label" :item="item" /></p>
          </div>
        </div>

        <slot name="actions" :item="item" />
      </button>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

interface Props {
  items: any;
  search: any;
  searchField: any;
}

const props = defineProps<Props>();

defineEmits<{
  (e: 'select', item: any): void;
}>();

const results = computed(() => {
  if (!props.search) {
    return props.items;
  }

  return props.items?.filter((item) => (props.searchField ? item[props.searchField] : item).includes(props.search));
});
</script>
