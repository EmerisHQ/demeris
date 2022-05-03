<template>
  <div
    class="absolute w-full h-full inset-0 z-[10] flex flex-col rounded-xl overflow-hidden bg-surface dark:bg-fg-solid"
  >
    <div
      :class="{ 'opacity-0': !showShadow }"
      class="transition-opacity duration-500 h-10 w-full block absolute bottom-0 z-[20] pointer-events-none scroll-shadow"
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

    <div ref="wrapperRef" class="flex-1 flex flex-col scroll-container">
      <div ref="contentRef" class="flex-1 flex flex-col px-6 pb-6 pt-2">
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useMagicKeys, useScroll, whenever } from '@vueuse/core';
import { computed, ref } from 'vue';

const emit = defineEmits(['esc']);
const contentRef = ref<HTMLElement | null>(null);
const wrapperRef = ref<HTMLElement | null>(null);

const contentScroll = useScroll(wrapperRef);
const { Escape } = useMagicKeys();

const showShadow = computed(() => {
  if (contentScroll.arrivedState.bottom) return false;
  return contentRef.value?.scrollHeight > wrapperRef.value?.clientHeight;
});

whenever(Escape, () => emit('esc'));
</script>

<style lang="postcss" scoped>
.scroll-container {
  @apply overflow-y-auto;
}
.scroll-container::-webkit-scrollbar {
  display: none;
}

.dark .scroll-shadow {
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.15), transparent);
}

.light .scroll-shadow {
  background: linear-gradient(0deg, rgba(255, 255, 255, 0.6), transparent);
}
</style>
