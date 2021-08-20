<template>
  <span>
    {{ amount }}
  </span>
</template>

<script lang="ts">
import BigNumber from 'bignumber.js';
import { computed, defineComponent, PropType } from 'vue';
import { useStore } from 'vuex';

import useAccount from '@/composables/useAccount';
import usePool from '@/composables/usePool';
import { Pool } from '@/types/actions';
import { parseCoins } from '@/utils/basic';

export default defineComponent({
  name: 'TooltipPoolAmount',

  props: {
    pool: {
      type: Object as PropType<Pool>,
      required: true,
    },
    denom: {
      type: String,
      required: true,
    },
  },

  setup(props) {
    const store = useStore();
    const { pool, reserveBalances, getPoolWithdrawBalances } = usePool((props.pool as Pool).id);

    const { balancesByDenom } = useAccount();

    const walletBalances = computed(() => {
      if (!pool.value || !reserveBalances.value?.length) {
        return;
      }
      const poolCoinBalances = balancesByDenom(pool.value.pool_coin_denom);
      const poolCoin = {
        denom: pool.value.pool_coin_denom,
        amount: poolCoinBalances.reduce((acc, item) => acc + +parseCoins(item.amount)[0].amount, 0),
      };
      const withdrawBalances = getPoolWithdrawBalances(poolCoin.amount);

      return withdrawBalances;
    });

    const amount = computed(() => {
      const precision = store.getters['demeris/getDenomPrecision']({
        name: props.denom,
      });
      const balance = walletBalances.value.find((b) => b.denom === props.denom);
      return new BigNumber(balance.amount).shiftedBy(-precision).toString();
    });

    return { amount };
  },
});
</script>
