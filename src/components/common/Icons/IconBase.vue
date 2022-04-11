<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    class="w-4 h-4"
    :width="props.width"
    :height="props.height"
    :viewBox="props.viewBox"
    :aria-labelledby="props.iconName"
  >
    <slot />
  </svg>
</template>

<script lang="ts" setup>
interface Props {
  viewBox?: string;
  width?: number | string;
  height?: number | string;
  iconName?: string;
}

const props = withDefaults(defineProps<Props>(), {
  viewBox: '0 0 24 24',
  width: 18,
  height: 18,
  iconName: '',
});
</script>
