<template>
  <span :style="{ height, width: computedWidth }" class="skeleton-loader rounded-md" />
</template>

<script>
export default {
  name: 'SkeletonLoader',
  props: {
    maxWidth: {
      // The default maxiumum width is 100%.
      default: 100,
      type: Number,
    },
    minWidth: {
      // Lines have a minimum width of 80%.
      default: 80,
      type: Number,
    },
    height: {
      // Make lines the same height as text.
      default: '1em',
      type: String,
    },
    width: {
      // Make it possible to define a fixed
      // width instead of using a random one.
      default: null,
      type: String,
    },
  },
  computed: {
    computedWidth() {
      // Either use the given fixed width or
      // a random width between the given min
      // and max values.
      return this.width || `${Math.floor(Math.random() * (this.maxWidth - this.minWidth) + this.minWidth)}%`
    },
  },
}
</script>

<style lang="scss">
.skeleton-loader {
  display: inline-block;
  position: relative;
  overflow: hidden;
  vertical-align: middle;
  background-color: rgba($color: #000000, $alpha: 0.1);

  &::after {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transform: translateX(-100%);
    background-image: linear-gradient(90deg, rgba(#fff, 0) 0, rgba(#fff, 0.2) 20%, rgba(#fff, 0.5) 60%, rgba(#fff, 0));
    animation: shimmer 2s infinite;
    content: '';
  }

  @keyframes shimmer {
    100% {
      transform: translateX(100%);
    }
  }
}
</style>
