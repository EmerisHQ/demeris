<template>
  <div class="total-price" :class="`total-price--${variant}`">
    {{ displayPrice[0] }}<span>.{{ displayPrice[1] }}</span>
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
    variant: {
      type: String as PropType<'styled' | 'none'>,
      default: 'styled',
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
      return formatter.format(Number.isFinite(value) ? value : 0).split('.');
    });
    return { displayPrice };
  },
});
</script>
<style lang="scss" scoped>
.total-price {
  &--styled {
    letter-spacing: -0.15rem;
  }

  &--styled span {
    font-size: 0.42em;
  }
}
</style>
