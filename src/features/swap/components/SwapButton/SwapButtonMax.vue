<template>
  <Button
    v-if="maxAmount"
    :class="{ 'text-negative-text': state.matches('ready.invalid.overMax') }"
    variant="link"
    size="sm"
    @click="handleClick"
  >
    Max <AmountDisplay :amount="maxAmount" />
  </Button>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import AmountDisplay from '@/components/common/AmountDisplay.vue';
import Button from '@/components/ui/Button.vue';
import { getBaseDenomSync } from '@/utils/actionHandler';

import { amountToHuman, getMaxAmount } from '../../swapMachineHelpers';
import { useSwapStore } from '../../swapStore';

const swap = useSwapStore();
const { state, send } = swap.useSwapMachine();

const maxAmount = computed(() => getMaxAmount(state.value.context));

const handleClick = () => {
  const denom = maxAmount.value.denom;
  const baseDenom = getBaseDenomSync(denom);
  const { amount } = amountToHuman({ amount: maxAmount.value.amount, denom: baseDenom });

  // TODO: Reduce fee

  send({ type: 'INPUT.CHANGE_AMOUNT', value: amount });
};
</script>
