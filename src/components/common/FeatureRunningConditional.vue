<template>
  <slot v-if="isActivated" />
  <slot v-else name="deactivated" />
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import { featureRunning } from '@/utils/FeatureManager';

const props = defineProps<{
  name: string;
}>();

const isActivated = computed(() => {
  const isRunning = featureRunning(props.name);
  if (isRunning === undefined) {
    return false;
  }
  return !!isRunning;
});
</script>
