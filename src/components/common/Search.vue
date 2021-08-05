<template>
  <div class="search">
    <div class="relative flex cursor-text" :style="isFocused ? '' : 'background-image: none'" @click="setFocus">
      <input
        ref="searchInput"
        :value="keyword"
        class="
          relative
          z-10
          h-12
          w-full
          py-2
          pr-4
          pl-10
          text-0
          font-normal
          text-text
          bg-fg
          focus:bg-surface focus:rounded-lg
          placeholder-inactive
          hover:placeholder-muted
          focus:placeholder-inactive
          rounded-xl
          border-none
          appearance-none
        "
        type="text"
        :placeholder="placeholder"
        @input="$emit('update:keyword', $event.target.value)"
      />
      <Icon
        class="icon-search absolute z-10 h-full px-3 text-muted pointer-events-none"
        :name="'MagnifyingGlassIcon'"
        :icon-size="1"
      />
      <Icon
        v-show="keyword !== ''"
        class="
          icon-reset
          absolute
          z-10
          h-full
          px-3
          right-0
          text-inactive
          hover:text-text
          focus:text-text
          cursor-pointer
          transition-colors
        "
        :name="'CloseCircleIcon'"
        :icon-size="1"
        @click="
          () => {
            $emit('update:keyword', '');
          }
        "
      />
      <div class="focus-border absolute z-0 -inset-0.5 rounded-xl invisible bg-gold-circular" />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';

import Icon from '@/components/ui/Icon.vue';
export default defineComponent({
  name: 'Search',
  components: { Icon },
  props: {
    keyword: { type: String, required: false, default: null },
    placeholder: { type: String, required: false, default: 'Search' },
  },
  emits: ['update:keyword'],
  setup() {
    const searchInput = ref(null);
    const isFocused = ref(false);

    function setFocus() {
      isFocused.value = true;
      searchInput.value.focus();
    }

    return {
      searchInput,
      setFocus,
      isFocused,
    };
  },
});
</script>
<style lang="scss" scoped>
input {
  outline: none;
}

input::placeholder {
  transition: color 150ms ease-out;
}

input:focus ~ .focus-border {
  visibility: visible;
}
</style>
