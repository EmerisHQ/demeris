<template>
  <div class="search">
    <Icon :name="'MagnifyingGlassIcon'" :icon-size="1.6" />
    <input class="s-0 w-normal" type="text" placeholder="Search assets" />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

import Icon from '@/components/ui/Icon.vue';
export default defineComponent({
  name: 'Search',
  components: { Icon },
});
</script>
<style lang="scss" scoped>
.search {
  display: flex;
  padding: 1rem 1.2rem;
  border-radius: 10px;
  background-color: var(--fg-trans);

  input {
    width: 100%;
    margin-left: 12px;
    outline: none;

    background-color: transparent;
  }

  input::placeholder {
    color: var(--inactive);
  }
}
</style>
