<template>
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M2 29L16 3L30 29H2Z"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path d="M16 13V20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    <path
      d="M16 25C16.5523 25 17 24.5523 17 24C17 23.4477 16.5523 23 16 23C15.4477 23 15 23.4477 15 24C15 24.5523 15.4477 25 16 25Z"
      fill="currentColor"
    />
  </svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'WarningTriangleIcon',
});
</script>

<style lang="scss" scoped>
svg {
  width: 1em;
  height: 1em;
}
</style>
