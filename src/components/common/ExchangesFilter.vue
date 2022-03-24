<template>
  <span class="flex items-center">
    <Search
      :keyword="searchValue"
      placeholder="Search exchanges"
      class="search ml-6 mr-3 grow"
      @update:keyword="onInput"
    />
    <span class="mr-6">{{ selectedExchangesLength }}/{{ exchanges?.length }}</span>
  </span>
  <div v-for="exchange in filteredExchanges" :key="exchange.name">
    <ListItemCheckbox
      :key="exchange.name"
      :icon-url="exchange.symbolUrl"
      :text="exchange.name"
      :is-checked="exchange.isSelected"
      class="h-10"
      @update:model-value="onUpdate"
    />
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, PropType, ref } from 'vue';

import Search from '@/components/common/Search.vue';
import ListItemCheckbox from '@/components/ui/List/ListItemCheckbox.vue';

type Exchange = { name: string; symbolUrl: string; isSelected: boolean };

export default defineComponent({
  name: 'ExchangesFilter',
  components: {
    ListItemCheckbox,
    Search,
  },
  props: {
    exchanges: {
      type: Array as PropType<Array<Exchange>>,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const searchValue = ref('');
    const exchanges = ref(props.exchanges);

    const onInput = (value: string) => {
      searchValue.value = value;
    };

    const selectedExchangesLength = computed(() => {
      const selectedExchanges = exchanges?.value?.filter((exchange) => {
        return exchange?.isSelected;
      });
      return selectedExchanges?.length;
    });

    const filteredExchanges = computed(() => {
      const filtered = exchanges?.value?.filter((exchange) => {
        return exchange?.name?.includes(searchValue.value);
      });
      return filtered;
    });

    const onUpdate = (e) => {
      exchanges.value.forEach((exchange) => {
        if (exchange?.name === e.text) {
          exchange.isSelected = e.isChecked;
        }
      });
      emit('update:modelValue', exchanges.value);
    };
    return { searchValue, onInput, onUpdate, selectedExchangesLength, filteredExchanges };
  },
});
</script>

<style lang="scss" scoped>
.search ::v-deep(input) {
  height: 2.5rem;
}
</style>
