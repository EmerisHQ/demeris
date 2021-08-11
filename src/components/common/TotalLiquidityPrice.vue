<template>
  {{ hasPrices ? toUSD(totalLiquidityPrice) : '-' }}
</template>

<script lang="ts">
import BigNumber from 'bignumber.js';
import { computed, defineComponent, PropType, ref, watch } from 'vue';
import { useStore } from 'vuex';

import usePool from '@/composables/usePool';
import usePools from '@/composables/usePools';
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
    const { pool, reserveBalances } = usePool((props.pool as Pool).id);
    const denoms = ref(pool.value.reserve_coin_denoms);
    const store = useStore();
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
    const { getReserveBaseDenoms } = usePools();

    const totalLiquidityPrice = ref(0);

    const hasPrices = computed(() => {
      const priceA = store.getters['demeris/getPrice']({ denom: denoms.value[0] });
      const priceB = store.getters['demeris/getPrice']({ denom: denoms.value[1] });

      if (!priceA || !priceB) {
        return false;
      }

      return true;
    });

    const updateTotalLiquidityPrice = async () => {
      if (!pool.value) {
        return;
      }

      const reserveDenoms = await getReserveBaseDenoms(pool.value);
      denoms.value = reserveDenoms;

      let total = 0;

      for (const [index, denom] of reserveDenoms.entries()) {
        const price = store.getters['demeris/getPrice']({ denom });
        const precision = store.getters['demeris/getDenomPrecision']({ name: denom }) ?? 6;

        const amount = reserveBalances.value[index].amount;
        if (!amount) {
          continue;
        }

        total += new BigNumber(amount).multipliedBy(price).shiftedBy(-precision).decimalPlaces(precision).toNumber();
      }

      totalLiquidityPrice.value = total;
    };

    watch(reserveBalances, updateTotalLiquidityPrice);

    return { hasPrices, totalLiquidityPrice, toUSD };
  },
});
</script>
