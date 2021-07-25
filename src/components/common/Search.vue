<template>
  <div class="search" :style="isFocused ? '' : 'background-image: none'" @click="setFocus">
    <input
      ref="searchInput"
      :value="keyword"
      class="text-0 font-normal"
      type="text"
      placeholder="Search assets"
      @input="$emit('update:keyword', $event.target.value)"
    />
    <Icon class="icon-search" :name="'MagnifyingGlassIcon'" :icon-size="1" />
    <Icon
      v-show="keyword !== ''"
      class="icon-reset"
      :name="'CloseCircleIcon'"
      :icon-size="1"
      @click="
        () => {
          $emit('update:keyword', '');
        }
      "
    />
    <div class="focus-border-1" />
    <div class="focus-border-2" />
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
  position: relative;
  display: flex;
  overflow: hidden;
  background-color: var(--fg);
  padding: 0.125rem;
  border-radius: 10px;

  /* background-image: linear-gradient(white, white), linear-gradient(to right, rgba(255, 222, 157, 1), #9ff9ff);
  background-origin: border-box;
  background-clip: content-box, border-box; */

  cursor: text;

  input {
    position: relative;
    z-index: 8;
    width: 100%;
    outline: none;
    padding: 0.75rem 1rem 0.75rem 2.5rem;
    height: 3rem;
    background-color: var(--fg);
  }

  input::placeholder {
    color: var(--inactive);
  }

  input:focus {
    background-color: var(--surface);
  }

  input:focus ~ .focus-border-1 {
    background-image: radial-gradient(
      112.28% 163.1% at -6.6% 25.47%,
      #ffde9d 0%,
      rgba(255, 155, 132, 0.74) 26.56%,
      rgba(156, 79, 255, 0) 100%
    );
    background-color: transparent;
  }

  input:focus ~ .focus-border-2 {
    background-image: linear-gradient(0deg, #9ff9ff, #9ff9ff);
    background-color: transparent;
  }

  .focus-border-1 {
    position: absolute;
    z-index: 7;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: var(--surface);
  }

  .focus-border-2 {
    position: absolute;
    z-index: 6;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: var(--surface);
  }

  .icon {
    position: absolute;
    z-index: 9;
    height: 100%;
    padding-bottom: 0.3125rem;
    color: var(--muted);
  }

  .icon-search {
    margin-left: 0.75rem;
  }

  .icon-reset {
    right: 0.75rem;
    cursor: pointer;
  }

  input:focus ~ .icon {
    color: var(--inactive) !important;
  }
}
</style>
