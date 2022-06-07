<template>
  <div
    v-show="!isMouseOver"
    class="white-overlay absolute w-full bottom-0 h-20 transition-all duration-200"
    @mouseenter="toggleVisibilitiy"
    @mouseleave="toggleVisibilitiy"
  />
</template>
<script setup lang="ts">
import { ref } from 'vue';
const isMouseOver = ref(false);

function toggleVisibilitiy() {
  if (isMouseOver.value) {
    setTimeout(() => {
      isMouseOver.value = !isMouseOver.value;
    }, 5000);
  } else {
    isMouseOver.value = !isMouseOver.value;
  }
}
</script>
<style lang="scss" scoped>
.white-overlay {
  // Todo: fix this on big assets selection modals
  // background: linear-gradient(180deg, transparent 0%, var(--surface) 100%);
  pointer-events: none;
}
</style>
