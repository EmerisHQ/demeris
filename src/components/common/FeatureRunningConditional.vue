<template>
  <slot v-if="isActivated" />
  <slot v-else name="deactivated" />
</template>

<script lang="ts" setup>
import { computed, withDefaults } from 'vue';

import { featureRunning } from '@/utils/FeatureManager';

interface Props {
  name: string;
}
const props = withDefaults(defineProps<Props>(), {
  name: '',
});

const isActivated = computed(() => {
  const isRunning = featureRunning(props.name);
  console.log('isRunning?', isRunning);
  if (isRunning === undefined) {
    return false;
  }
  return !!isRunning;
});
</script>
