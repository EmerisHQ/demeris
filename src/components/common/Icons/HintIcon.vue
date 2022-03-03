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
      <g transform="matrix(1.0583333,0,0,1.0583333,0,280.06665)" style="fill: none">
        <circle style="stroke: currentColor; stroke-opacity: 0.98617512" r="7.5" cy="8" cx="8" />
        <path
          style="fill: currentColor; fill-opacity: 1"
          d="M 7.29061,10.0497 H 8.44149 V 9.99211 C 8.46067,8.80287 8.76757,8.28497 9.61155,7.75749 10.4555,7.24439 10.9542,6.50591 10.9542,5.44615 c 0,-1.49614 -1.0933,-2.58948 -2.78125,-2.58948 -1.55368,0 -2.78608,0.95907 -2.85801,2.58948 H 6.52336 C 6.59529,4.31445 7.38652,3.8541 8.17295,3.8541 c 0.90152,0 1.63041,0.59462 1.63041,1.5345 0,0.76246 -0.43638,1.30912 -0.99743,1.64959 C 7.86605,7.60883 7.305,8.16509 7.29061,9.99211 Z m 0.6138,2.8388 c 0.47474,0 0.86316,-0.3884 0.86316,-0.8632 0,-0.4747 -0.38842,-0.8631 -0.86316,-0.8631 -0.47473,0 -0.86315,0.3884 -0.86315,0.8631 0,0.4748 0.38842,0.8632 0.86315,0.8632 z"
        />
      </g>
    </g>
  </svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HintIcon',
})
</script>

<style lang="scss" scoped>
svg {
  width: 1em;
  height: 1em;
}
</style>
