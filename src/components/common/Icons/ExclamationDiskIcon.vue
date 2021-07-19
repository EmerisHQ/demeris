<template>
  <svg fill="none" height="32" viewBox="0 0 32 32" width="32" xmlns="http://www.w3.org/2000/svg">
    <path
      d="m16 0c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16zm1.929 7-.929 12h-2l-.929-12zm-1.929 18c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2z"
      fill="#ec7100"
    />
  </svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ExclamationIcon',
});
</script>

<style lang="scss" scoped>
svg {
  width: 1em;
  height: 1em;
}
</style>
