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
  padding: calc(4.8rem + 8rem) 3.2rem;
  max-width: 120rem;
  margin: 0 auto;
  height: 100vh;
  min-height: 100vh;
}
</style>
