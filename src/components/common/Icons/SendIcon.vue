<template>
  <svg
    xmlns:dc="http://purl.org/dc/elements/1.1/"
    xmlns:cc="http://creativecommons.org/ns#"
    xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
    xmlns:svg="http://www.w3.org/2000/svg"
    xmlns="http://www.w3.org/2000/svg"
    version="1.1"
    viewBox="0 0 16.933333 16.933334"
    height="64"
    width="64"
  >
    <g transform="translate(0,-280.06665)">
      <g transform="matrix(1.057858,0,0,1.0578592,-0.53273119,280.07418)" style="fill: none">
        <path
          style="stroke: currentColor; stroke-linecap: round; stroke-linejoin: round; stroke-miterlimit: 10"
          stroke-miterlimit="10"
          d="M 8.5,11.5 V 0.5"
        />
        <path
          style="stroke: currentColor; stroke-linecap: round; stroke-linejoin: round; stroke-miterlimit: 10"
          stroke-miterlimit="10"
          d="m 13.5,5.5 -5,-5 -5,5"
        />
        <path
          style="stroke: currentColor; stroke-linecap: round; stroke-linejoin: round; stroke-miterlimit: 10"
          stroke-miterlimit="10"
          d="M 15.5,15.5 H 1.5"
        />
      </g>
    </g>
  </svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SendIcon',
});
</script>

<style lang="scss" scoped>
svg {
  width: 1em;
  height: 1em;
}
</style>
