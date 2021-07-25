<template>
  <Header />
  <div class="layout-frame">
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import Header from '@/components/layout/Header.vue';

export default defineComponent({
  name: 'DefaultLayout',
  components: {
    Header,
  },
});
</script>

<style scoped lang="scss">
.layout-frame {
  padding: 3rem 2rem 8rem;
  max-width: 1200px;

  margin: 0 auto;
  /* height: 100vh; */
  min-height: calc(100vh - 6.25rem);
}
</style>
