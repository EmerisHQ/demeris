<template>
  <span>{{ displayValue }} {{ displayDenom }}</span>
</template>
<script lang="ts">
import { computed, defineComponent, PropType, ref, watch } from 'vue';

import { useStore } from '@/store';
import { Amount } from '@/types/base';
import { getDisplayName } from '@/utils/actionHandler';
export default defineComponent({
  name: 'AmountDisplay',
  props: {
    amount: { type: Object as PropType<Amount>, required: true },
    chain: {
      type: String,
      default: undefined,
    },
  },
  setup(props) {
    const store = useStore();

    const displayDenom = ref('-');

    const displayValue = computed(() => {
      const precision =
        store.getters['demeris/getDenomPrecision']({
          name: (props.amount as Amount).denom,
        }) ?? '6';
      return parseInt((props.amount as Amount).amount) / Math.pow(10, parseInt(precision));
    });

    watch(
      () => props.amount,
      async () => {
        if ((props.amount as Amount).denom !== undefined) {
          displayDenom.value = await getDisplayName(
            (props.amount as Amount).denom,
            props.chain || store.getters['demeris/getDexChain'],
          );
        }
      },
      { immediate: true },
    );

    return { displayDenom, displayValue };
  },
});
</script>
