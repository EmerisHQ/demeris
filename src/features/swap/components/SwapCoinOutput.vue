<template>
  <SwapCoin
    :input="state.context.outputAmount"
    :denom="state.context.outputCoin?.denom"
    :chain="state.context.outputCoin?.chain"
    :is-loading-amount="state.matches('updating.routes.input')"
    :is-loading-chain="state.matches('updating.routes.output')"
    @select="swap.openAssetsMenu('output')"
    @update:input="send({ type: 'OUTPUT.CHANGE_AMOUNT', value: $event })"
  >
    <template #label> Receive </template>
    <template #header>
      <div class="flex ml-auto font-normal text-muted -text-1">
        Best price <Icon class="ml-1.5" name="StarIcon" :icon-size="0.875" />
      </div>
    </template>
  </SwapCoin>
</template>

<script lang="ts" setup>
import Icon from '@/components/ui/Icon.vue';

import { useSwapStore } from '../swapStore';
import SwapCoin from './SwapCoin.vue';
const swap = useSwapStore();
const { state, send } = swap.useSwapMachine();
</script>
