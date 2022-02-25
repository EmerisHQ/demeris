<template>
  {{ display }}
</template>
<script lang="ts">
import { defineComponent, ref, toRefs, watch } from 'vue';

import { GlobalDemerisGetterTypes, TypedAPIStore } from '@/store';
import { getDisplayName } from '@/utils/actionHandler';
import { useStore } from '@/utils/useStore';

export default defineComponent({
  name: 'Denom',
  props: {
    name: { type: String, required: true },
  },
  setup(props) {
    const apistore = useStore() as TypedAPIStore;
    const propName = toRefs(props).name;
    let display = ref('-');
    const updateDenom = async (denomName) => {
      display.value = await getDisplayName(denomName, apistore.getters[GlobalDemerisGetterTypes.API.getDexChain]);
    };

    watch(
      propName,
      (denomName) => {
        updateDenom(denomName);
      },
      { immediate: true },
    );

    return { display };
  },
});
</script>
