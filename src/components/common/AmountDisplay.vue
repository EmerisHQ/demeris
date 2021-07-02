<template>
  <span>{{ displayValue }} {{ displayDenom }}</span>
</template>
<script lang="ts">
import { computed, defineComponent, onMounted, PropType, ref } from 'vue';

import { useStore } from '@/store';
import { Amount } from '@/types/base';
import { getDisplayName } from '@/utils/actionHandler';
export default defineComponent({
  name: 'AmountDisplay',
  props: {
    amount: { type: Object as PropType<Amount>, required: true },
  },
  setup(props) {
    const store = useStore();

    const displayDenom = ref('-');
    onMounted(async () => {
      displayDenom.value = await getDisplayName((props.amount as Amount).denom, store.getters['demeris/getDexChain']);
    });
    const displayValue = computed(() => {
      const precision =
        store.getters['demeris/getDenomPrecision']({
          name: (props.amount as Amount).denom,
        }) ?? '6';
      return parseInt((props.amount as Amount).amount) / Math.pow(10, parseInt(precision));
    });
    return { displayDenom, displayValue };
  },
});
</script>
