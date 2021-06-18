<template>
  <svg width="11" height="13" viewBox="0 0 11 13" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="gradient" x1="3.5" y1="1.5" x2="8.5" y2="13.5" gradientUnits="userSpaceOnUse">
        <stop stop-color="#27E7DC" />
        <stop offset=".915" stop-color="#FFFD38" />
      </linearGradient>
    </defs>
    <path
      d="M10.04 13V9.48L7.6 12.34H4.2V6.98h2.42l1.26 1.56V4.58L6.62 6.34H4.2V1.02h3.4L10 3.8V.5H.46v.28s1 .06 1 1.42v9.1c0 1.32-1 1.42-1 1.42V13h9.58z"
      fill="url(#gradient)"
    />
  </svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Logo',
});
</script>
