<template>
  <Header />
  <div class="layout-frame pt-4 sm:pt-6 md:pt-12 pb-20 md:pb-32">
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import Header from '@/components/layout/Header.vue';

export default defineComponent({
  name: 'NoMarginLayout',
  components: {
    Header,
  },
});
</script>

<style scoped lang="scss">
.layout-frame {
  min-height: calc(100vh - 16rem); // minus navbar] height and layout padding
}
</style>
