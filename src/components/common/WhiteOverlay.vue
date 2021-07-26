<template>
  <div
    v-show="!isMouseOver"
    class="white-overlay absolute w-full bottom-0 transition-all duration-200"
    @mouseenter="toggleVisibilitiy"
    @mouseleave="toggleVisibilitiy"
  />
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
export default defineComponent({
  name: 'WhiteOverlay',
  setup() {
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
    return { toggleVisibilitiy, isMouseOver };
  },
});
</script>
<style lang="scss" scoped>
.white-overlay {
  background: linear-gradient(180deg, transparent 0%, var(--surface) 100%);
  pointer-events: none;
}
</style>
