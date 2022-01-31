<template>
  <span class="flex items-center">
    <SearchBox
      :model-value="searchValue"
      placeholder="Search exchanges"
      class="ml-6 mr-3"
      @update:model-value="onInput"
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

import ListItemCheckbox from '@/components/ui/List/ListItemCheckbox.vue';
import SearchBox from '@/components/ui/SearchBox.vue';

type exchange = { name: string; symbolUrl: string; isSelected: boolean };

export default defineComponent({
  name: 'ExchangesFilter',
  components: {
    ListItemCheckbox,
    SearchBox,
  },
  props: {
    exchanges: {
      type: Array as PropType<Array<exchange>>,
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

<style lang="scss" scoped></style>
