<template>
  <div>
    {{ display }}
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, toRefs, watch } from 'vue';

import { GlobalGetterTypes, RootStoreTyped } from '@/store';
import { getDisplayName } from '@/utils/actionHandler';
import { useStore } from '@/utils/useStore';

export default defineComponent({
  name: 'Denom',
  props: {
    name: { type: String, required: true },
  },
  setup(props) {
    const typedstore = useStore() as RootStoreTyped;
    const propName = toRefs(props).name;
    let display = ref('-');
    const updateDenom = async (denomName) => {
      display.value = await getDisplayName(denomName, typedstore.getters[GlobalGetterTypes.API.getDexChain]);
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
