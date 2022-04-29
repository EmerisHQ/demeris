<template>
  <template v-if="swap.shownRoutes">
    <SwapOverlay @esc="closeOverlay">
      <template #title> Quotes </template>
      <template #actions>
        <Button variant="link" size="sm" @click="swap.toggleRoutes">
          <Icon name="CloseIcon" :icon-size="1.5" />
        </Button>
      </template>
      <template #caption>Fees included</template>

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
            <span class="font-medium text-left">{{ quoteDexText(route) }}</span>
            <span class="font-medium text-right">
              <AmountDisplay :amount="getOutputAmount(index)" />
            </span>
          </div>
          <div class="flex items-center justify-between w-full">
            <button
              class="opacity-60 hover:-translate-y-px transition-all text-left"
              @click.stop="showRouteDetail(index)"
            >
              {{ countTransactionsFromRoute(state.context, index) }} transactions
            </button>
            <div class="opacity-60 flex text-right">~<Price :amount="getOutputAmount(index)" /></div>
          </div>
        </button>
      </div>
    </SwapOverlay>

    <SwapOverlayRouteDetail
      v-if="routeDetailIndex !== undefined"
      :route-index="routeDetailIndex"
      @close="closeRouteDetail"
    />
  </template>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';

import AmountDisplay from '@/components/common/AmountDisplay.vue';
import Price from '@/components/common/Price.vue';
import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';
import {
  countTransactionsFromRoute,
  formatProtocolName,
  getChainFromProtocol,
  getOutputAmountFromRoute,
  getProtocolsFromRoute,
  resolveBaseDenom,
} from '@/features/swap/logic';
import { useSwapActor, useSwapStore } from '@/features/swap/state';

import SwapOverlay from './SwapOverlay.vue';
import SwapOverlayRouteDetail from './SwapOverlayRouteDetail.vue';

const swap = useSwapStore();
const { state, send } = useSwapActor();

const routeDetailIndex = ref(undefined);

const routes = computed(() => state.value.context.data.routes);
const selectedRouteIndex = computed(() => state.value.context.selectedRouteIndex);

const protocols = (route) => {
  if (!route) return [];
  const protocols = getProtocolsFromRoute(route);
  return protocols.map((protocol) => {
    return { chain: getChainFromProtocol(protocol), name: formatProtocolName(protocol) };
  });
};

const quoteDexText = (route) => {
  const allProtocols = protocols(route);
  if (allProtocols?.length >= 2) {
    return `${allProtocols?.length} DEXs`;
  } else if (allProtocols?.length === 1) {
    return allProtocols[0].name;
  } else return 'Unknown';
};

const isBestRoute = (index: number) => index === 0;

const showRouteDetail = (index: number) => {
  routeDetailIndex.value = index;
};

const closeRouteDetail = () => {
  routeDetailIndex.value = undefined;
  swap.toggleRoutes();
};

const closeOverlay = () => {
  swap.toggleRoutes();
  routeDetailIndex.value = undefined;
};

const selectRoute = (index: number) => {
  send({ type: 'ROUTE.SELECT_INDEX', value: index });
  swap.toggleRoutes();
};

const getOutputAmount = (index: number) => {
  const output = getOutputAmountFromRoute(state.value.context, index);
  return {
    ...output,
    denom: resolveBaseDenom(output.denom, { context: state.value.context }),
  };
};
</script>
