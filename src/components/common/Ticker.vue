<template>
  {{ ticker }}
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';

import useDenoms from '@/composables/useDenoms';

interface Props {
  name: string;
  chain?: string;
}

const props = withDefaults(defineProps<Props>(), {
  chain: undefined,
});

let ticker = ref('-');
const loaded = false;
const { useDenom } = useDenoms();
watch(
  () => props.name,
  (denomName, oldDenomName) => {
    if (denomName != oldDenomName || !loaded) {
      const { tickerName } = useDenom(denomName, props.chain);
      watch(
        () => tickerName.value,
        (newName) => {
          ticker.value = newName;
        },
        { immediate: true },
      );
    }
  },
  { immediate: true },
);
</script>
