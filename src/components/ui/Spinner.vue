<template>
  <svg
    class="spinner"
    x="0"
    y="0"
    :width="`${size * 16}px`"
    :height="`${size * 16}px`"
    :viewBox="`0 0 ${size * 16} ${size * 16}`"
    :style="`--spinner-dashoffset-0: ${0.66 * size * 16}; --spinner-dashoffset-50: ${3.14 * size * 16};`"
  >
    <circle
      :cx="(size * 16) / 2"
      :cy="(size * 16) / 2"
      r="18"
      fill="transparent"
      :stroke="variant === 'gold' ? `url(#${fillId})` : 'currentColor'"
      stroke-width="3"
      stroke-linecap="round"
      :style="`stroke-dasharray: ${3.14 * size * 16}; transform-origin: ${0.5 * size * 16}px ${0.5 * size * 16}px 0;`"
    ></circle>
    <defs>
      <pattern
        :id="fillId"
        height="100%"
        width="100%"
        patternContentUnits="objectBoundingBox"
        viewBox="0 0 1 1"
        preserveAspectRatio="xMidYMid slice"
      >
        <image
          height="1"
          width="1"
          preserveAspectRatio="xMidYMid slice"
          xlink:href="~@/assets/images/texture-gold-circular.jpg"
        ></image>
      </pattern>
    </defs>
  </svg>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

type SpinnerVariant = 'solid' | 'gold';

export default defineComponent({
  name: 'Spinner',

  props: {
    size: {
      type: Number,
      default: 2,
    },
    variant: {
      type: String as PropType<SpinnerVariant>,
      default: 'gold',
    },
  },

  data() {
    const randomId = Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, '')
      .substr(2, 10);

    return {
      fillId: `spinner-fill-${randomId}`,
    };
  },
});
</script>

<style lang="scss" scoped>
.spinner circle {
  animation: spinner 2s linear infinite;
}

@keyframes spinner {
  0% {
    transform: rotate(0deg);
    stroke-dashoffset: var(--spinner-dashoffset-0);
  }
  50% {
    transform: rotate(720deg);
    stroke-dashoffset: var(--spinner-dashoffset-50);
  }
  100% {
    transform: rotate(1080deg);
    stroke-dashoffset: var(--spinner-dashoffset-0);
  }
}
</style>
