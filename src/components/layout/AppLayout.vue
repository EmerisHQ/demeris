<template>
  <component :is="layout || DefaultLayout">
    <slot />
  </component>
</template>

<script setup lang="ts">
import { markRaw, watch } from 'vue';
import { useRoute } from 'vue-router';

import DefaultLayout from '@/layouts/DefaultLayout.vue';
import NoMarginLayout from '@/layouts/NoMarginLayout.vue';

const layout = markRaw(DefaultLayout);
const route = useRoute();

const components = {
  DefaultLayout,
  NoMarginLayout,
};

watch(
  () => route.meta,
  (meta) => {
    const component = components[meta.layout as string];
    layout.value = component;
  },
  { immediate: true },
);
</script>
