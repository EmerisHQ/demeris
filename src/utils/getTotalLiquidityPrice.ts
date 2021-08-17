import { ref, watch } from 'vue';

import usePool from '@/composables/usePool';
import usePools from '@/composables/usePools';
import { store } from '@/store/index';
import { Pool } from '@/types/actions';

export default function (thePool: Pool): any {
  const { pool, reserveBalances } = usePool((thePool as Pool).id);
  const { getReserveBaseDenoms } = usePools();

  const totalLiquidityPrice = ref(0);

  const updateTotalLiquidityPrice = async () => {
    if (!pool.value) {
      return;
    }

    const baseDenoms = await getReserveBaseDenoms(pool.value);

    let total = 0;

    baseDenoms.map((denom) => {
      const price = store.getters['demeris/getPrice']({ denom });
      const precision = store.getters['demeris/getDenomPrecision']({ name: denom });
      const balance = reserveBalances.value.find((b) => {
        return b.base_denom === denom;
      });
      const amount = balance.amount;
      console.log('denom:', denom, 'reserveBalances.value', reserveBalances.value);
      if (price && amount) {
        const liquidityPrice = (amount / Math.pow(10, precision)) * price;
        total += liquidityPrice;
      }
    });

    totalLiquidityPrice.value = total;
  };

  watch(reserveBalances, updateTotalLiquidityPrice, { immediate: true });

  return totalLiquidityPrice;
}
