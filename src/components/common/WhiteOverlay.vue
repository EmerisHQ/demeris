<template>
  <div v-show="!isMouseOver" class="white-overlay" @mouseenter="toggleVisibilitiy" @mouseleave="toggleVisibilitiy" />
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
