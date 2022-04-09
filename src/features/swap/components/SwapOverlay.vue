<template>
  <div class="absolute bg-bg w-full h-full inset-0 z-50 flex flex-col scroll-container">
    <div class="flex justify-between items-center sticky top-0 bg-bg p-6">
      <slot name="header">
        <div class="flex flex-col">
          <h2 class="text-2 font-bold">
            <slot name="title" />
          </h2>
          <p class="text-muted text-0"><slot name="subtitle" /></p>
        </div>
        <slot name="actions" />
      </slot>
    </div>

    <div class="flex-1 flex flex-col px-6 pb-6">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps(['title']);
</script>

<style lang="postcss" scoped>
.scroll-container {
  @apply overflow-y-auto;
}
.scroll-container::-webkit-scrollbar {
  display: none;
}
</style>
