<template>
  <IconBase width="16" height="20" viewBox="0 0 16 20" icon-name="Notice icon">
    <path
      d="M8 17.5C12.1421 17.5 15.5 14.1421 15.5 10C15.5 5.85786 12.1421 2.5 8 2.5C3.85786 2.5 0.5 5.85786 0.5 10C0.5 14.1421 3.85786 17.5 8 17.5Z"
      :stroke="isDark ? 'white' : 'black'"
      stroke-opacity="0.33"
      stroke-miterlimit="10"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M8 8C8.55228 8 9 7.55228 9 7C9 6.44772 8.55228 6 8 6C7.44772 6 7 6.44772 7 7C7 7.55228 7.44772 8 8 8Z"
      :fill="isDark ? 'white' : 'black'"
      fill-opacity="0.33"
    />
    <path
      d="M8 14.5V10.5"
      :stroke="isDark ? 'white' : 'black'"
      stroke-opacity="0.33"
      stroke-miterlimit="10"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </IconBase>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import IconBase from '@/components/common/Icons/IconBase.vue';
import useTheme from '@/composables/useTheme';

const isDark = computed(() => {
  const theme = useTheme();
  return theme.value === 'dark';
});
</script>
