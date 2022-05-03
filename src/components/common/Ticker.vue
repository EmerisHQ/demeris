<template>
  {{ ticker }}
</template>
<script lang="ts">
import { defineComponent, ref, watch } from 'vue';

import useDenoms from '@/composables/useDenoms';

export default defineComponent({
  name: 'Ticker',
  props: {
    name: { type: String, required: true },
    chain: { type: String, default: undefined },
  },
  setup(props) {
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

    return { ticker };
  },
});
</script>
