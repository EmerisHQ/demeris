<template>
  <ErrorDisplay v-if="error" :width="props.width" :height="props.height" :error="error" @try-again="tryAgain" />
  <Suspense v-else>
    <template #default>
      <slot />
    </template>
    <template #fallback>
      <SkeletonLoader :width="props.width" :height="props.height" />
    </template>
  </Suspense>
</template>

<script lang="ts" setup>
import { defineProps, onErrorCaptured, ref, watch, withDefaults } from 'vue';

import ErrorDisplay from '@/components/common/ErrorDisplay.vue';
import SkeletonLoader from '@/components/common/loaders/SkeletonLoader.vue';

interface AsyncBoundaryProps {
  width?: string;
  height?: string;
  autoRetry?: boolean;
}

const props = withDefaults(defineProps<AsyncBoundaryProps>(), {
  autoRetry: true,
  width: undefined,
  height: undefined,
});
const error = ref(null);
const retry = ref(0);
const tryAgain = () => {
  retry.value++;
};

watch(
  () => retry.value,
  (newValue) => {
    setTimeout(() => {
      error.value = null;
    }, getRefetchTimeout(newValue));
  },
);

onErrorCaptured((err) => {
  error.value = err;
  if (props.autoRetry) tryAgain();
  return true;
});

/**
 * @desc retry every 3 seconds, increase exponentially after 5 retries. Max 30 seconds
 * @param retryCount
 */
function getRefetchTimeout(retryCount: number) {
  // TODO : put all constants into separate file or into default input
  if (retryCount < 5) {
    return 3000;
  }
  return Math.min(Math.floor(Math.pow(retryCount, 1.2) * 1000), 30 * 1000);
}
</script>
