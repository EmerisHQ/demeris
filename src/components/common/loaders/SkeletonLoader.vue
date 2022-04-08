<template>
  <span :style="{ height, width: computedWidth }" class="skeleton-loader rounded-md" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
interface Props {
  maxWidth?: number;
  minWidth?: number;
  height?: string;
  width?: string;
}

const props = withDefaults(defineProps<Props>(), { maxWidth: 100, minWidth: 80, height: '1em', width: null });
const computedWidth = computed(() => {
  return props.width || `${Math.floor(Math.random() * (props.maxWidth - props.minWidth) + props.minWidth)}%`;
});
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
