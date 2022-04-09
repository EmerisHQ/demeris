<template>
  <SwapCoin
    :input="state.context.inputAmount"
    :denom="state.context.inputCoin?.denom"
    :chain="state.context.inputCoin?.chain"
    @select="swap.openAssetsMenu('input')"
    @update:input="send({ type: 'UPDATE_INPUT_AMOUNT', value: $event })"
  >
    <template #label> Pay </template>
    <template #header>
      <SwapButtonMax />
    </template>
  </SwapCoin>
</template>

<script lang="ts" setup>
import { useSwapStore } from '../swapStore';
import SwapButtonMax from './SwapButtonMax.vue';
import SwapCoin from './SwapCoin.vue';

const swap = useSwapStore();
const { state, send } = swap.useSwapMachine();
</script>
