<template>
  <slot v-if="isActivated" />
  <slot v-else name="deactivated" />
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import { featureRunning } from '@/utils/FeatureManager';

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
});

const isActivated = computed(() => {
  const result = featureRunning(props.name);
  if (result === undefined) {
    return false;
  }
  return !!result;
});
</script>
