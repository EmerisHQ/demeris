<template>
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 5L5 19" stroke="currentColor" stroke-width="2" stroke-miterlimit="10" stroke-linecap="square" />
    <path d="M19 19L5 5" stroke="currentColor" stroke-width="2" stroke-miterlimit="10" stroke-linecap="square" />
  </svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'CloseIcon',
});
</script>

<style lang="scss" scoped>
svg {
  width: 1em;
  height: 1em;
}
</style>
