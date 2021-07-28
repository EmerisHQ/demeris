<template>
  <Header />
  <div class="layout-frame pt-4 sm:pt-6 md:pt-12 px-5 md:px-8 pb-20 md:pb-32 max-w-7xl mx-auto">
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
  min-height: calc(100vh - 8rem); // minus navbar height and layout padding-top
}
</style>
