<template>
  <div class="search" :style="isFocused ? '' : 'background-image: none'" @click="setFocus">
    <Icon :name="'MagnifyingGlassIcon'" :icon-size="1.6" />
    <input
      ref="searchInput"
      :value="keyword"
      class="s-0 w-normal"
      type="text"
      placeholder="Search assets"
      @input="$emit('update:keyword', $event.target.value)"
    />
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
  display: flex;
  border-radius: 10px;
  background-color: var(--fg-trans);

  border: 2px solid transparent;

  background-image: linear-gradient(white, white), linear-gradient(to right, rgba(255, 222, 157, 1), #9ff9ff);
  background-origin: border-box;
  background-clip: content-box, border-box;

  cursor: text;

  input {
    width: 100%;
    margin-left: 12px;
    outline: none;
    margin: 1.15rem 1.2rem;
    background-color: transparent;
    border: 2px solid transparent;
  }

  input::placeholder {
    color: var(--inactive);
  }

  .icon {
    margin-left: 1.2rem;
  }
}
</style>
