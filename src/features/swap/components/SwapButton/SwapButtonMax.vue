<template>
  <button
    v-if="maxAmount"
    class="-text-1 hover:text-link transition-colors"
    :class="{
      'text-negative-text': state.matches('ready.invalid.overMax'),
    }"
    @click="handleClick"
  >
    Max <AmountDisplay :amount="maxAmount" />
  </button>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import AmountDisplay from '@/components/common/AmountDisplay.vue';
import { getBaseDenomSync } from '@/utils/actionHandler';

import { amountToHuman, getMaxInputAmount } from '../../swapHelpers';
import { useSwapStore } from '../../swapStore';

const swap = useSwapStore();
const { state, send } = swap.useSwapMachine();

const maxAmount = computed(() => getMaxInputAmount(state.value.context));

const handleClick = () => {
  const denom = maxAmount.value.denom;
  const baseDenom = getBaseDenomSync(denom);
  const { amount } = amountToHuman({ amount: maxAmount.value.amount, denom: baseDenom });

  // TODO: Reduce fee

  send({ type: 'INPUT.CHANGE_AMOUNT', value: amount });
};
</script>
