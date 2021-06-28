<template>
  <div>
    {{ displayPrice[0] }}<span>.{{ displayPrice[1] }}</span>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, onMounted, PropType } from 'vue';

import { useStore } from '@/store';
import { GlobalDemerisActionTypes } from '@/store/demeris/action-types';
import { Amount } from '@/types/base';

export default defineComponent({
  name: 'Price',
  props: {
    amount: {
      type: Object as PropType<Amount>,
      required: true,
    },
  },
  setup(props) {
    const store = useStore();
    onMounted(async () => {
      await store.dispatch(GlobalDemerisActionTypes.GET_PRICES, { subscribe: true });
    });
    const displayPrice = computed(() => {
      const precision =
        store.getters['demeris/getDenomPrecision']({
          name: (props.amount as Amount).denom,
        }) || 0;
      let value;
      if ((props.amount as Amount).amount) {
        value =
          (store.getters['demeris/getPrice']({ denom: (props.amount as Amount).denom }) *
            parseInt((props.amount as Amount).amount)) /
          Math.pow(10, parseInt(precision));
      } else {
        value = store.getters['demeris/getPrice']({ denom: (props.amount as Amount).denom });
      }
      var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',

        // These options are needed to round to whole numbers if that's what you want.
        //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
      });
      return formatter.format(value).split('.');
    });
    return { displayPrice };
  },
});
</script>
