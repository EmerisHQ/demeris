<template>
  <component :is="layout">
    <slot />
  </component>
</template>

<script setup lang="ts">
import { markRaw, watch } from 'vue';
import { useRoute } from 'vue-router';

import DefaultLayout from './DefaultLayout.vue';

const layout = markRaw(DefaultLayout);
const route = useRoute();
watch(
  () => route.meta,
  async (meta) => {
    try {
      const component = await import(/* @vite-ignore */ `./${meta.layout}.vue`);
      layout.value = component?.default || DefaultLayout;
    } catch (e) {
      layout.value = DefaultLayout;
    }
  },
  { immediate: true },
);
</script>
