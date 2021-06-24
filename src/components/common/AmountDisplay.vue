<template>
  <span>{{ displayValue }} {{ displayDenom }}</span>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';

import { useStore } from '@/store';
import { Amount } from '@/types/base';
export default defineComponent({
  name: 'AmountDisplay',
  props: {
    amount: { type: Object as PropType<Amount>, required: true },
  },
  setup(props) {
    const store = useStore();

    const displayDenom = computed(() => {
      const displayName = store.getters['demeris/getDisplayDenom']({
        name: (props.amount as Amount).denom,
      });
      return displayName || ((props.amount as Amount).denom as string).substr(1).toUpperCase();
    });
    const displayValue = computed(() => {
      const precision =
        store.getters['demeris/getDenomPrecision']({
          name: (props.amount as Amount).denom,
        }) || 0;
      return parseInt((props.amount as Amount).amount) / Math.pow(10, parseInt(precision));
    });
    return { displayDenom, displayValue };
  },
});
</script>
