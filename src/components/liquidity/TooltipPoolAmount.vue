<template>
  <span>
    {{ amount }}
  </span>
</template>

<script setup lang="ts">
import BigNumber from 'bignumber.js';
import { computed } from 'vue';
import { useStore } from 'vuex';

import useAccount from '@/composables/useAccount';
import usePool from '@/composables/usePool';
import { GlobalGetterTypes, RootStoreTyped } from '@/store';
import { Pool } from '@/types/actions';
import { parseCoins } from '@/utils/basic';

interface Props {
  pool: Pool;
  denom: string;
}

const props = defineProps<Props>();

const typedstore = useStore() as RootStoreTyped;
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
  const precision = typedstore.getters[GlobalGetterTypes.API.getDenomPrecision]({
    name: props.denom,
  });
  const balance = walletBalances.value?.find((b) => b.denom === props.denom);
  const balanceAmount = new BigNumber(balance?.amount).shiftedBy(-precision);
  return balanceAmount.toFixed(6);
});
</script>
