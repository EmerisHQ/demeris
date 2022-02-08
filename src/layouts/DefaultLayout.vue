<template>
  <Header />
  <div
    class="layout-frame pt-4 sm:pt-6 md:pt-12 pb-20 md:pb-32"
    :class="noMargin ? '' : 'px-5 md:px-8 max-w-7xl mx-auto'"
  >
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
  props: {
    noMargin: {
      type: Boolean,
      default: false,
    },
  },
});
</script>

<style scoped lang="scss">
.layout-frame {
  min-height: calc(100vh - 16rem); // minus navbar] height and layout padding
}
</style>
