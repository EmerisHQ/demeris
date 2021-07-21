<template>
  <span>{{ displayValue }} {{ ticker }}</span>
</template>
<script lang="ts">
import { computed, defineComponent, PropType, ref, watch } from 'vue';

import { useStore } from '@/store';
import { Amount } from '@/types/base';
import { getTicker } from '@/utils/actionHandler';
export default defineComponent({
  name: 'AmountDisplay',
  props: {
    amount: { type: Object as PropType<Amount>, required: true },
  },
  setup(props) {
    const store = useStore();

    const ticker = ref('-');

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
        ticker.value = await getTicker((props.amount as Amount).denom, store.getters['demeris/getDexChain']);
      },
      { immediate: true },
    );

    return { ticker, displayValue };
  },
});
</script>
