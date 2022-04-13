<template>
  <div class="absolute bg-bg w-full h-full inset-0 z-[10] flex flex-col">
    <div class="h-6 w-full block absolute bottom-0 z-[20] pointer-events-none" :class="`scroll-shadow--${theme}`" />

    <header class="flex justify-between items-center bg-bg p-6 z-50">
      <slot name="header">
        <div class="flex flex-col">
          <h2 class="text-2 font-bold">
            <slot name="title" />
          </h2>
          <p class="text-muted text-0"><slot name="caption" /></p>
        </div>
        <slot name="actions" />
      </slot>
    </header>

    <slot name="subheader" />

    <div class="flex-1 flex flex-col px-6 pb-6 pt-2 scroll-container">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useMagicKeys, whenever } from '@vueuse/core';

import useTheme from '@/composables/useTheme';

const emit = defineEmits(['esc']);

const theme = useTheme();
const { Escape } = useMagicKeys();

whenever(Escape, () => emit('esc'));
</script>

<style lang="postcss" scoped>
.scroll-container {
  @apply overflow-y-auto;
}
.scroll-container::-webkit-scrollbar {
  display: none;
}

.scroll-shadow--dark {
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.9), transparent);
}

.scroll-shadow--light {
  background: linear-gradient(0deg, rgba(255, 255, 255, 0.9), transparent);
}
</style>
