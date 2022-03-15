<template>
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M15 8C15 4.13401 11.866 1 8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15"
      stroke="currentColor"
      stroke-width="1.6"
      stroke-miterlimit="10"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'LoadingIcon',
});
</script>

<style lang="scss" scoped>
svg {
  width: 1em;
  height: 1em;
  animation: rotate 1s infinite;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}
</style>
