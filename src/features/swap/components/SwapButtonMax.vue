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
import { GlobalGetterTypes } from '@/store';
import { getBaseDenomSync } from '@/utils/actionHandler';
import { useStore } from '@/utils/useStore';

import { getMaxAmount } from '../swapMachineHelpers';
import { useSwapStore } from '../swapStore';

const globalStore = useStore();

const swap = useSwapStore();
const { state, send } = swap.useSwapMachine();

const maxAmount = computed(() => getMaxAmount(state.value.context));

const handleClick = () => {
  const denom = maxAmount.value.denom;
  const baseDenom = getBaseDenomSync(denom);
  const precision = globalStore.getters[GlobalGetterTypes.API.getDenomPrecision]({ name: baseDenom }) ?? 6;
  const amount = maxAmount.value?.amount / Math.pow(10, precision);

  // TODO: Reduce fee

  send({ type: 'INPUT.CHANGE_AMOUNT', value: amount });
};
</script>
