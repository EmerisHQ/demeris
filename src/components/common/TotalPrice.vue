<template>
  <div>
    {{ displayPrice[0] }}<span :class="styled ? 'decimals' : ''">.{{ displayPrice[1] }}</span>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';

import { useStore } from '@/store';
import { Balances } from '@/types/api';
export default defineComponent({
  name: 'TotalPrice',
  props: {
    balances: {
      type: Array as PropType<Balances>,
      required: true,
    },
    styled: {
      type: Boolean as PropType<boolean>,
      default: true,
    },
  },
  setup(props) {
    const store = useStore();

    const displayPrice = computed(() => {
      const value = (props.balances as Balances).reduce((total, balance) => {
        if (balance.verified) {
          if (store.getters['demeris/getPrice']({ denom: balance.base_denom })) {
            return (
              total +
              (parseInt(balance.amount) * store.getters['demeris/getPrice']({ denom: balance.base_denom })) /
                Math.pow(
                  10,
                  parseInt(
                    store.getters['demeris/getDenomPrecision']({
                      name: balance.base_denom,
                    }),
                  ),
                )
            );
          } else {
            return total;
          }
        } else {
          return total;
        }
      }, 0);
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
<style lang="scss" scoped>
.decimals {
  font-size: 0.42em;
}
</style>
