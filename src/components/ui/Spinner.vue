<template>
  <svg
    class="spinner animate-spin"
    :class="`spinner--${variant}`"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    :style="{ fontSize: `${size}rem` }"
  >
    <defs>
      <linearGradient id="gradient" gradientTransform="rotate(113)">
        <stop offset="0%" :stop-color="gradients[0]" />
        <stop offset="100%" :stop-color="gradients[1]" />
      </linearGradient>
    </defs>
    <circle
      class="spinner__circle"
      cx="12"
      cy="12"
      r="10"
      :stroke="variant === 'gradient' ? 'url(#gradient)' : color"
      stroke-width="3"
      stroke-dasharray="90 150"
      stroke-dashoffset="-15"
    ></circle>
  </svg>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

type SpinnerVariant = 'solid' | 'gradient';

export default defineComponent({
  name: 'Spinner',

  props: {
    size: {
      type: Number,
      default: 1.6,
    },
    gradients: {
      type: Array,
      default: () => ['#DA9FFE', '#5E6BFF'],
    },
    color: {
      type: [Number, String],
      default: 'currentColor',
    },
    variant: {
      type: String as PropType<SpinnerVariant>,
      default: 'gradient',
    },
  },
});
</script>

<style lang="scss" scoped>
.spinner {
  width: 1em;
  height: 1em;

  &--solid &__circle {
    opacity: 0.25;
  }
}
</style>
