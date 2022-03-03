<template>
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.5 0.5H0.5V11.5H11.5V0.5Z" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M13.5 4.5H15.5V15.5H4.5V13.5" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'CopyIcon',
})
</script>

<style lang="scss" scoped>
svg {
  width: 1em;
  height: 1em;
}
</style>
