<template>
  <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" />
    <path
      d="M12 8V12.9a1 1 0 0 0 .558.897L15 15"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'TimeIcon',
})
</script>

<style lang="scss" scoped>
svg {
  width: 1em;
  height: 1em;
}
</style>
