<template>
  <SwapCoin
    ref-key="inputAmountRef"
    :input="state.context.inputAmount"
    :denom="state.context.inputCoin?.denom"
    :base-denom="state.context.inputCoin?.baseDenom"
    :chain="state.context.inputCoin?.chain"
    :is-loading-amount="state.matches('updating.routes.output')"
    @select="swapStore.openAssetsMenu('input')"
    @update:input="send({ type: 'INPUT.CHANGE_AMOUNT', value: $event })"
  >
    <template #label> Pay </template>
    <template #header>
      <SwapButtonMax />
    </template>
  </SwapCoin>
</template>

<script lang="ts" setup>
import { useSwapActor, useSwapStore } from '@/features/swap/state';

import SwapButtonMax from '../SwapButton/SwapButtonMax.vue';
import SwapCoin from './SwapCoin.vue';

const swapStore = useSwapStore();
const { state, send } = useSwapActor();
</script>
