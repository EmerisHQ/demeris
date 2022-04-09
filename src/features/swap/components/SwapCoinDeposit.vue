<template>
  <SwapCoin
    :input="state.context.depositAmount"
    :denom="state.context.depositCoin?.denom"
    :chain="state.context.depositCoin?.chain"
    @select="swap.openAssetsMenu('deposit')"
    @update:input="send({ type: 'UPDATE_DEPOSIT_AMOUNT', value: $event })"
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
