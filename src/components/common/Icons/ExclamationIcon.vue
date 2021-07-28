<template>
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M16 0C7.178 0 0 7.178 0 16C0 24.822 7.178 32 16 32C24.822 32 32 24.822 32 16C32 7.178 24.822 0 16 0ZM17.929 7L17 19H15L14.071 7H17.929ZM16 25C14.895 25 14 24.105 14 23C14 21.895 14.895 21 16 21C17.105 21 18 21.895 18 23C18 24.105 17.105 25 16 25Z"
      style="fill: currentColor"
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
