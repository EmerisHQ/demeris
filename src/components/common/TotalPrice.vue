<template>${{ displayPrice }}</template>
<script lang="ts">
import { computed, defineComponent, onMounted, PropType } from 'vue';

import { useStore } from '@/store';
import { GlobalDemerisActionTypes } from '@/store/demeris/action-types';
import { Balances } from '@/types/api';
export default defineComponent({
  name: 'TotalPrice',
  props: {
    balances: {
      type: Array as PropType<Balances>,
      required: true,
    },
  },
  setup(props) {
    const store = useStore();
    onMounted(async () => {
      await store.dispatch(GlobalDemerisActionTypes.GET_PRICES, { subscribe: true });
    });

    const displayPrice = computed(() => {
      return (props.balances as Balances).reduce((total, balance) => {
        return balance.verified
          ? total + parseInt(balance.amount) * store.getters['demeris/getPrice']({ denom: balance.base_denom })
          : total;
      }, 0);
    });
    return { displayPrice };
  },
});
</script>
