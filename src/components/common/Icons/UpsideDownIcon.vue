<template>
  <svg
    xmlns:dc="http://purl.org/dc/elements/1.1/"
    xmlns:cc="http://creativecommons.org/ns#"
    xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
    xmlns:svg="http://www.w3.org/2000/svg"
    xmlns="http://www.w3.org/2000/svg"
    version="1.1"
    viewBox="0 0 24 24"
  >
    <path
      d="M4.5 16.5L7.5 19.5L10.5 16.5"
      stroke="black"
      stroke-miterlimit="10"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path d="M7.5 7.5L7.5 19.5" stroke="black" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
    <path
      d="M13.5 7.5L16.5 4.5L19.5 7.5"
      stroke="black"
      stroke-miterlimit="10"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path d="M16.5 16.5V4.5" stroke="black" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
</template>
<script>
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'UpsideDownIcon',
});
</script>
<style lang="scss" scoped>
svg {
  width: 1em;
  height: 1em;
}
</style>
