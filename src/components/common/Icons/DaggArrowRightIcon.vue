<template>
  <IconBase :width="16" :height="16" view-box="0 0 16 16" icon-name="Dagg arrow right">
    <path
      d="M3 8L13 8"
      stroke="currentColor"
      stroke-width="1.6"
      stroke-miterlimit="10"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M10 12L14 8L10 4"
      stroke="currentColor"
      stroke-width="1.6"
      stroke-miterlimit="10"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </IconBase>
</template>

<script lang="ts" setup>
import IconBase from '@/components/common/Icons/IconBase.vue';
</script>
