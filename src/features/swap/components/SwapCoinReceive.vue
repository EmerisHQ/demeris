<template>
  <SwapCoin
    :input="state.context.receiveAmount"
    :denom="state.context.receiveCoin?.denom"
    :chain="state.context.receiveCoin?.chain"
    @select="swap.openAssetsMenu('receive')"
    @update:input="send({ type: 'UPDATE_RECEIVE_AMOUNT', value: $event })"
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
