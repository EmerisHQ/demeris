<template>
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 12H2" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" />
    <path d="M9 19L2 12L9 5" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="square" />
  </svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ArrowLeftIcon',
});
</script>
<style lang="scss" scoped>
svg {
  width: 1em;
  height: 1em;
}
</style>
