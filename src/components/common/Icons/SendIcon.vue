<template>
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22V2" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" />
    <path d="M5 9L12 2L19 9" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="square" />
  </svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SendIcon',
});
</script>

<style lang="scss" scoped>
svg {
  width: 1em;
  height: 1em;
}
</style>
