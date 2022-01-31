<template>
  <span class="flex search-input-container">
    <Icon name="MagnifyingGlassIcon" :icon-size="1" class="text-inactive pl-3" />
    <input
      v-model="model"
      :placeholder="placeholder"
      type="text"
      autocomplete="off"
      minlength="1"
      spellcheck="false"
      class="bg-transparent pt-3 pr-5 pb-3 pl-2 w-full"
    />
  </span>
</template>
<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';

import Icon from '@/components/ui/Icon.vue';

export default defineComponent({
  name: 'SearchBox',
  components: {
    Icon,
  },
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String as PropType<string>,
      default: 'Search',
    },
  },
  emits: ['update:modelValue'],

  setup(props, { emit }) {
    const model = computed({
      get: () => (props.modelValue || '').toString(),
      set: (value) => emit('update:modelValue', value),
    });
    return { model };
  },
});
</script>
<style lang="scss" scoped>
.search-input-container {
  width: 100%;
  background-color: rgba(0, 0, 0, 0.03);
  border-radius: 10px;
  height: 40px;
  font-size: 16px;
}
</style>
