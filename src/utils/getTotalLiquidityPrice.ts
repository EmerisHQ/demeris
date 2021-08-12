import { ref, watch } from 'vue';

import usePool from '@/composables/usePool';
import usePools from '@/composables/usePools';
import { store } from '@/store/index';
import { Pool } from '@/types/actions';

export default function (thePool: Pool): any {
  const { pool, reserveBalances } = usePool((thePool as Pool).id);
  const denoms = ref(pool.value.reserve_coin_denoms);
  const { getReserveBaseDenoms } = usePools();

  const totalLiquidityPrice = ref(0);

  const updateTotalLiquidityPrice = async () => {
    if (!pool.value) {
      return;
    }

    const reserveDenoms = await getReserveBaseDenoms(pool.value);
    denoms.value = reserveDenoms;

    let total = 0;

    for (const [index, denom] of reserveDenoms.entries()) {
      const price = store.getters['demeris/getPrice']({ denom });

      // if one token doesn't have a price, we can't get an accorate total liquidity price
      if (!price) {
        return;
      }

      const precision = store.getters['demeris/getDenomPrecision']({ name: denom }) || 6;

      const amount = reserveBalances.value[index].amount;
      if (!amount) {
        continue;
      }

      total += (amount / Math.pow(10, precision)) * price;
    }

    totalLiquidityPrice.value = total;
  };

  watch(reserveBalances, updateTotalLiquidityPrice, { immediate: true });

  return totalLiquidityPrice;
}
