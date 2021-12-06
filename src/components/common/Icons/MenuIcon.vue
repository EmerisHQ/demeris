<template>
  <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path
      d="M8 5h13M8 12h13M8 19h13"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <g fill="currentColor">
      <circle cx="3" cy="5" r="1" />
      <circle cx="3" cy="12" r="1" />
      <circle cx="3" cy="19" r="1" />
    </g>
  </svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MenuIcon',
});
</script>
<style lang="scss" scoped>
svg {
  width: 1em;
  height: 0.1818em;
  margin: 0.3586em 0em;
}
</style>
