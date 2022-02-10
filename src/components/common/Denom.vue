<template>
  {{ display }}
</template>
<script lang="ts">
import { defineComponent, ref, toRefs, watch } from 'vue';

import useDenoms from '@/composables/useDenoms';
import { GlobalDemerisGetterTypes, TypedAPIStore } from '@/store';
import { getDisplayName } from '@/utils/actionHandler';
import { featureRunning } from '@/utils/FeatureManager';
import { useStore } from '@/utils/useStore';

export default defineComponent({
  name: 'Denom',
  props: {
    name: { type: String, required: true },
  },
  setup(props) {
    if (featureRunning('FIX_WRONG_DENOM_NAME_ON_ASSET_PAGE')) {
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
    } else {
      let display = ref('-');
      const loaded = false;
      const { useDenom } = useDenoms();
      const name = toRefs(props).name;
      watch(
        () => name.value,
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
    }
  },
});
</script>
