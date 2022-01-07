<template>
  {{ display }}
</template>
<script lang="ts">
import { defineComponent, ref, watch } from 'vue';

import useDenoms from '@/composables/useDenoms';

export default defineComponent({
  name: 'Denom',
  props: {
    name: { type: String, required: true },
  },
  setup(props) {
    let display = ref('-');
    const loaded = false;
    const { useDenom } = useDenoms();
    watch(
      () => props.name,
      (denomName, oldDenomName) => {
        if (denomName != oldDenomName || !loaded) {
          const { displayName } = useDenom(denomName);
          watch(
            () => displayName.value,
            (newName) => {
              display.value = newName;
            },
            { immediate: true },
          );
        }
      },
      { immediate: true },
    );

    return { display };
  },
});
</script>
