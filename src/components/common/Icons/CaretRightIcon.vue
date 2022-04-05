<template>
  <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M0.999998 13.001L7 7.00098L0.999999 1.00098"
      :stroke="isDark ? 'white' : 'black'"
      stroke-opacity="0.667"
      stroke-width="1.6"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import useTheme from '@/composables/useTheme';

export default defineComponent({
  name: 'CaretRightIcon',
  computed: {
    isDark() {
      const theme = useTheme();
      return theme.value === 'dark';
    },
  },
});
</script>

<style lang="scss" scoped>
svg {
  width: 1em;
  height: 1em;
}
</style>
