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
  },
  setup(props) {
    let ticker = ref('-');
    const loaded = false;
    const { useDenom } = useDenoms();
    watch(
      () => props.name,
      (denomName, oldDenomName) => {
        if (denomName != oldDenomName || !loaded) {
          const { tickerName } = useDenom(denomName);
          ticker = tickerName;
        }
      },
      { immediate: true },
    );

    return { ticker };
  },
});
</script>
