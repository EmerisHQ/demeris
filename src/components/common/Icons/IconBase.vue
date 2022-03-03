<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="width"
    :height="height"
    :viewBox="viewBox"
    :aria-labelledby="iconName"
  >
    <g :fill="iconColor">
      <slot />
    </g>
  </svg>
</template>

<script>
export default {
  props: {
    viewBox: { type: String, default: '0 0 24 24' },
    iconName: { type: String, default: '' },
    width: { type: [Number, String], default: 18 },
    height: { type: [Number, String], default: 18 },
    iconColor: { type: String, default: 'transparent' },
  },
}
</script>
