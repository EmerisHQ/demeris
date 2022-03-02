<template>
  <component :is="layout">
    <slot />
  </component>
</template>

<script lang="ts">
import { defineComponent, markRaw, watch } from 'vue';
import { useRoute } from 'vue-router';

import DefaultLayout from './DefaultLayout.vue';
export default defineComponent({
  name: 'AppLayout',
  setup() {
    const layout = markRaw(DefaultLayout);
    const route = useRoute();
    watch(
      () => route.meta,
      async (meta) => {
        try {
          const component = await import(`@/layouts/${meta.layout}.vue`);
          layout.value = component?.default || DefaultLayout;
        } catch (e) {
          layout.value = DefaultLayout;
        }
      },
      { immediate: true },
    );
    return { layout };
  },
});
</script>
