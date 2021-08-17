<template>
  <span>
    {{
      showShare
        ? toUSD((ownShare / 100) * totalLiquidityPrice.value) + ' (' + ownShare.toFixed(2) + '%)'
        : toUSD(ownSharePrice)
    }}
  </span>
</template>

<script lang="ts">
import BigNumber from 'bignumber.js';
import { computed, defineComponent, PropType } from 'vue';
import { useStore } from 'vuex';

import useAccount from '@/composables/useAccount';
import usePool from '@/composables/usePool';
import usePools from '@/composables/usePools';
import { Pool } from '@/types/actions';
import { parseCoins } from '@/utils/basic';
import getTotalLiquidityPrice from '@/utils/getTotalLiquidityPrice';

//import TrendingUpIcon from '../common/Icons/TrendingUpIcon.vue';

export default defineComponent({
  name: 'OwnLiquidityPrice',

  //components: { TrendingUpIcon },

  props: {
    pool: {
      type: Object as PropType<Pool>,
      required: true,
    },
    showShare: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
  },

  setup(props) {
    const { pool, reserveBalances, calculateWithdrawBalances, reserveBaseDenoms, totalSupply } = usePool(
      (props.pool as Pool).id,
    );

    const store = useStore();

    const { balancesByDenom } = useAccount();

    const hasPrices = computed(() => {
      let baseDenoms = reserveBaseDenoms.value;
      if (!baseDenoms) {
        baseDenoms = props.pool.reserve_coin_denoms;
      }
      const priceA = store.getters['demeris/getPrice']({ denom: baseDenoms[0] });
      const priceB = store.getters['demeris/getPrice']({ denom: baseDenoms[1] });

      if (!priceA || !priceB) {
        return false;
      }

      return true;
    });

    const toUSD = (value) => {
      if (!hasPrices.value) {
        return '-';
      }

      var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',

        // These options are needed to round to whole numbers if that's what you want.
        //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
      });
      return formatter.format(Number.isNaN(value) ? 0 : value);
    };

    const totalLiquidityPrice = computed(() => {
      if (pool.value) {
        return getTotalLiquidityPrice(pool.value);
      }
      return 0;
    });

    const ownShare = computed(() => {
      if (!pool.value || !totalSupply.value || !walletBalances.value?.poolCoin?.amount) {
        return 0;
      }

      return new BigNumber(walletBalances.value.poolCoin.amount)
        .dividedBy(totalSupply.value)
        .multipliedBy(100)
        .toNumber();
    });

    const walletBalances = computed(() => {
      if (!pool.value || !reserveBalances.value?.length) {
        return;
      }

      const poolCoinBalances = balancesByDenom(pool.value.pool_coin_denom);

      const poolCoin = {
        denom: pool.value.pool_coin_denom,
        amount: poolCoinBalances.reduce((acc, item) => acc + +parseCoins(item.amount)[0].amount, 0),
      };
      const withdrawBalances = calculateWithdrawBalances(poolCoin.amount);

      return {
        coinA: withdrawBalances[0],
        coinB: withdrawBalances[1],
        poolCoin,
      };
    });

    return { ownShare, totalLiquidityPrice, toUSD };
  },
});
</script>
