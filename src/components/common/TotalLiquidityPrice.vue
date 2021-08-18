<template>
  {{ totalLiquidityPrice ? toUSD(totalLiquidityPrice) : '-' }}
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

import usePool from '@/composables/usePool';
import { Pool } from '@/types/actions';

//import TrendingUpIcon from '../common/Icons/TrendingUpIcon.vue';

export default defineComponent({
  name: 'TotalLiquidityPrice',

  //components: { TrendingUpIcon },

  props: {
    pool: {
      type: Object as PropType<Pool>,
      required: true,
    },
  },

  setup(props) {
    const toUSD = (value) => {
      var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',

        // These options are needed to round to whole numbers if that's what you want.
        //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
      });
      return formatter.format(value);
    };

    const { totalLiquidityPrice } = usePool(props.pool.id);

    return { totalLiquidityPrice, toUSD };
  },
});
</script>
