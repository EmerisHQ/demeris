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
  padding-top: 11rem;
  min-height: 100vh;
}
</style>
