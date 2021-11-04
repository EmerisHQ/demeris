<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path
      d="M12 9v4M10.363 3.957l-8.106 14.06a2.048 2.048 0 0 0-.006 1.98c.166.3.404.552.692.728.289.176.616.271.95.275h16.214a1.86 1.86 0 0 0 .95-.275c.288-.176.526-.427.692-.729a2.05 2.05 0 0 0-.005-1.979l-8.107-14.06a1.95 1.95 0 0 0-.698-.701 1.859 1.859 0 0 0-1.878 0 1.95 1.95 0 0 0-.698.701v0Z"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <circle cx="12" cy="17" r="1" fill="currentColor" />
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
