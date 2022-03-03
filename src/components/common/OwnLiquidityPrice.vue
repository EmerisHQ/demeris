<template>
  <span>
    <CurrencyDisplay :value="(ownShare / 100) * totalLiquidityPrice" />
    <span v-if="showShare">{{ ' (' + ownShare.toFixed(2) + '%)' }}</span>
  </span>
</template>

<script lang="ts">
import BigNumber from 'bignumber.js'
import { computed, defineComponent, PropType } from 'vue'

import useAccount from '@/composables/useAccount'
import usePool from '@/composables/usePool'
import { Pool } from '@/types/actions'
import { parseCoins } from '@/utils/basic'

import CurrencyDisplay from '../ui/CurrencyDisplay.vue'

//import TrendingUpIcon from '../common/Icons/TrendingUpIcon.vue';

export default defineComponent({
  components: { CurrencyDisplay },

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
    const { pool, reserveBalances, getPoolWithdrawBalances, totalLiquidityPrice, totalSupply } = usePool(
      (props.pool as Pool).id,
    )

    const { balancesByDenom } = useAccount()

    const ownShare = computed(() => {
      if (!pool.value || !totalSupply.value || !walletBalances.value?.poolCoin?.amount) {
        return 0
      }

      return new BigNumber(walletBalances.value.poolCoin.amount)
        .dividedBy(totalSupply.value)
        .multipliedBy(100)
        .toNumber()
    })

    const walletBalances = computed(() => {
      if (!pool.value || !reserveBalances.value?.length) {
        return
      }
      const poolCoinBalances = balancesByDenom(pool.value.pool_coin_denom)

      const poolCoin = {
        denom: pool.value.pool_coin_denom,
        amount: poolCoinBalances.reduce((acc, item) => acc + +parseCoins(item.amount)[0].amount, 0),
      }
      const withdrawBalances = getPoolWithdrawBalances(poolCoin.amount)

      return {
        coinA: withdrawBalances[0],
        coinB: withdrawBalances[1],
        poolCoin,
      }
    })

    return { ownShare, totalLiquidityPrice }
  },
})
</script>
