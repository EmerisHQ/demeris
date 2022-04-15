<template>
  <div
    ref="wrapperRef"
    class="absolute w-full h-full inset-0 z-[10] flex flex-col rounded-xl overflow-hidden bg-surface dark:bg-fg-solid"
  >
    <div
      v-if="showShadow"
      class="h-6 w-full block absolute bottom-0 z-[20] pointer-events-none"
      :class="`scroll-shadow--${theme}`"
    />

    <header class="flex justify-between items-center bg-surface dark:bg-fg-solid p-6 z-50">
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

    <div ref="contentRef" class="flex-1 flex flex-col px-6 pb-6 pt-2 scroll-container">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useMagicKeys, whenever } from '@vueuse/core';
import { computed, ref } from 'vue';

import useTheme from '@/composables/useTheme';

const emit = defineEmits(['esc']);
const contentRef = ref<HTMLElement | null>(null);
const wrapperRef = ref<HTMLElement | null>(null);

const theme = useTheme();
const { Escape } = useMagicKeys();

const showShadow = computed(() => contentRef.value?.scrollHeight > wrapperRef.value?.clientHeight);

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
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.25), transparent);
}

.scroll-shadow--light {
  background: linear-gradient(0deg, rgba(255, 255, 255, 0.9), transparent);
}
</style>
