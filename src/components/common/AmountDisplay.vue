<template>
  <span>{{ displayValue }} {{ ticker }}</span>
</template>
<script lang="ts">
import { EmerisBase } from '@emeris/types';
import { computed, defineComponent, PropType, ref, toRefs, watch } from 'vue';
import { useStore } from 'vuex';

import { GlobalGetterTypes } from '@/store';
import { getBaseDenomSync, getTicker } from '@/utils/actionHandler';

export default defineComponent({
  name: 'AmountDisplay',
  props: {
    amount: { type: Object as PropType<EmerisBase.Amount>, required: true },
    chain: {
      type: String,
      default: undefined,
    },
  },
  setup(props) {
    const store = useStore();
    const propsRef = toRefs(props);

    const baseDenom = computed(() => {
      return getBaseDenomSync(propsRef.amount.value.denom);
    });
    const precision = computed(() => {
      return store.getters[GlobalGetterTypes.API.getDenomPrecision]({ name: baseDenom.value }) ?? 6;
    });
    const ticker = ref('-');

    const displayValue = computed(() => {
      return parseInt(props.amount.amount) / Math.pow(10, precision.value);
    });

    watch(
      () => props.amount,
      async () => {
        if (props.amount.denom !== undefined) {
          ticker.value = await getTicker(
            props.amount.denom,
            props.chain || store.getters[GlobalGetterTypes.API.getDexChain],
          );
        }
      },
      { immediate: true },
    );

    return { ticker, displayValue };
  },
});
</script>
