<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    :class="props.iconClass"
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
  iconClass?: string;
  viewBox?: string;
  width?: number | string;
  height?: number | string;
  iconName?: string;
}

const props = withDefaults(defineProps<Props>(), {
  iconClass: 'w-[1em] h-[1em]',
  viewBox: '0 0 24 24',
  width: 24,
  height: 24,
  iconName: '',
});
</script>
