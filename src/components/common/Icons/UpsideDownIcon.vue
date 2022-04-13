<template>
  <IconBase :width="16" :height="16" view-box="0 0 16 16" icon-name="Upside down arrows icon">
    <path
      d="M15.5 3.5L12.5 0.5L9.5 3.5"
      stroke="currentColor"
      stroke-miterlimit="10"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M12.5 12.5L12.5 0.5"
      stroke="currentColor"
      stroke-miterlimit="10"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M6.5 12.5L3.5 15.5L0.5 12.5"
      stroke="currentColor"
      stroke-miterlimit="10"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M3.5 3.5L3.5 15.5"
      stroke="currentColor"
      stroke-miterlimit="10"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </IconBase>
</template>

<script lang="ts" setup>
import IconBase from '@/components/common/Icons/IconBase.vue';
</script>
