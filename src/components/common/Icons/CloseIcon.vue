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
      <g transform="matrix(1.0062339,0,0,1.0062339,0,280.06665)" style="fill: none">
        <g transform="translate(-0.58578644,-0.58578644)" style="fill: none">
          <path
            style="stroke: currentColor; stroke-width: 2; stroke-linecap: square; stroke-miterlimit: 10"
            d="M 16,2 2,16"
            stroke-miterlimit="10"
          />
          <path
            style="stroke: currentColor; stroke-width: 2; stroke-linecap: square; stroke-miterlimit: 10"
            d="M 16,16 2,2"
            stroke-miterlimit="10"
          />
        </g>
      </g>
    </g>
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
