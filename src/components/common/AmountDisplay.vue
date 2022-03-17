<template>
  <span>{{ displayValue }} {{ ticker }}</span>
</template>
<script lang="ts">
import { EmerisBase } from '@emeris/types';
import { computed, defineComponent, PropType, ref, watch } from 'vue';
import { useStore } from 'vuex';

import { GlobalGetterTypes } from '@/store';
import { getBaseDenom, getTicker } from '@/utils/actionHandler';

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
    const baseDenom = ref(props.amount?.denom);

    const ticker = ref('-');

    const displayValue = computed(() => {
      const precision = store.getters[GlobalGetterTypes.API.getDenomPrecision]({ name: baseDenom.value }) ?? 6;
      return parseInt(props.amount.amount) / Math.pow(10, precision);
    });

    watch(
      () => props.amount,
      async () => {
        if (props.amount.denom !== undefined) {
          ticker.value = await getTicker(
            props.amount.denom,
            props.chain || store.getters[GlobalGetterTypes.API.getDexChain],
          );
          baseDenom.value = await getBaseDenom(props.amount.denom);
        }
      },
      { immediate: true },
    );

    return { ticker, displayValue };
  },
});
</script>
