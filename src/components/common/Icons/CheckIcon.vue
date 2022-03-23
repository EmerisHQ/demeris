<template>
  <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M1 7L5 11L15 1"
      stroke="currentColor"
      stroke-miterlimit="10"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'CheckIcon',
});
</script>
<style lang="scss" scoped>
svg {
  width: 1em;
  height: 1em;
}
</style>
