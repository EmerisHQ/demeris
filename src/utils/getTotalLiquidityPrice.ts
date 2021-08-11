import { ref, watch } from 'vue';

import usePool from '@/composables/usePool';
import usePools from '@/composables/usePools';
import { useStore } from '@/store';
import { Pool } from '@/types/actions';

export default function (thePool: Pool): number {
  const { pool, reserveBalances } = usePool((thePool as Pool).id);
  const denoms = ref(pool.value.reserve_coin_denoms);
  const store = useStore();
  const { getReserveBaseDenoms } = usePools();

  const totalLiquidityPrice = ref(0);

  const updateTotalLiquidityPrice = async () => {
    if (!pool.value) {
      return;
    }

    const reserveDenoms = await getReserveBaseDenoms(pool.value);
    if (reserveDenoms) {
      denoms.value = reserveDenoms;

      let total = 0;

      for (const [index, denom] of reserveDenoms.entries()) {
        if (denom.substring(0, 4) !== 'pool') {
          const price = store.getters['demeris/getPrice']({ denom });
          const precision = store.getters['demeris/getDenomPrecision']({ name: denom }) || 6;

          const amount = reserveBalances.value[index].amount;
          if (!amount) {
            continue;
          }

          total += (amount / Math.pow(10, precision)) * price;
        }
      }

      totalLiquidityPrice.value = total;
    }
  };

  watch(reserveBalances, updateTotalLiquidityPrice);

  return totalLiquidityPrice.value;
}
