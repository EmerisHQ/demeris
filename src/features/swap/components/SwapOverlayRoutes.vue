<template>
  <SwapOverlay v-if="swap.shownRoutes">
    <template #title> Quotes </template>
    <template #actions>
      <Button variant="link" @click="swap.toggleRoutes">Done</Button>
    </template>
    <template #subtitle>Fees included</template>

    <div role="menu" class="-mx-6 flex flex-col space-y-2">
      <button
        v-for="(route, index) in routes"
        :key="index"
        class="rounded-lg mx-2 p-4 flex flex-col"
        :class="[selectedRouteIndex === index ? 'bg-text text-inverse' : 'hover:bg-fg']"
        @click="selectRoute(index)"
      >
        <p v-if="isBestRoute(index)" class="text-positive">Best price</p>
        <div class="flex items-center justify-between w-full">
          <span class="font-medium">{{ formatProtocolName(getProtocolFromRoute(route)) }}</span>
          <span class="font-medium"><AmountDisplay :amount="getOutputAmountFromRoute(state.context, index)" /></span>
        </div>
        <div class="flex items-center justify-between w-full">
          <button class="opacity-60">{{ route.steps.length }} transactions</button>
          <div class="opacity-60 flex">~<Price :amount="getOutputAmountFromRoute(state.context, index)" /></div>
        </div>
      </button>
    </div>
  </SwapOverlay>
</template>

<script lang="ts" setup>
import { computed } from '@vue/reactivity';

import AmountDisplay from '@/components/common/AmountDisplay.vue';
import Price from '@/components/common/Price.vue';
import Button from '@/components/ui/Button.vue';

import { formatProtocolName, getOutputAmountFromRoute, getProtocolFromRoute } from '../swapMachineHelpers';
import { useSwapStore } from '../swapStore';
import SwapOverlay from './SwapOverlay.vue';

const swap = useSwapStore();
const { state, send } = swap.useSwapMachine();

const routes = computed(() => state.value.context.data.routes);
const selectedRouteIndex = computed(() => state.value.context.selectedRouteIndex);

const isBestRoute = (index: number) => index === 0;

const selectRoute = (index: number) => {
  send({ type: 'ROUTE.SELECT_INDEX', value: index });
  swap.toggleRoutes();
};
</script>
