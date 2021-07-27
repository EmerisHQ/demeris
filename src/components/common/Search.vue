<template>
  <div class="search relative flex cursor-text" :style="isFocused ? '' : 'background-image: none'" @click="setFocus">
    <input
      ref="searchInput"
      :value="keyword"
      class="
        relative
        h-12
        w-full
        py-2
        pr-4
        pl-10
        text-0
        font-normal
        text-text
        bg-fg
        focus:bg-surface
        rounded-xl
        border-none
        appearance-none
      "
      type="text"
      placeholder="Search assets"
      @input="$emit('update:keyword', $event.target.value)"
    />
    <Icon
      class="icon-search absolute h-full px-3 text-muted pointer-events-none"
      :name="'MagnifyingGlassIcon'"
      :icon-size="1"
    />
    <Icon
      v-show="keyword !== ''"
      class="icon-reset absolute h-full px-3 right-0 text-muted cursor-pointer"
      :name="'CloseCircleIcon'"
      :icon-size="1"
      @click="
        () => {
          $emit('update:keyword', '');
        }
      "
    />
    <div class="focus-border absolute -inset-0.5 invisible bg-gold-circular" />
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
.search {
  input {
    z-index: 8;
    outline: none;
  }

  input::placeholder {
    color: var(--inactive);
  }

  .focus-border {
    z-index: 7;
    border-radius: 0.75rem;
  }

  input:focus ~ .focus-border {
    visibility: visible;
  }

  .icon {
    z-index: 9;
  }

  input:focus ~ .icon {
    color: var(--inactive);
  }
}
</style>
