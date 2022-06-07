<template>
  <SwapCoin
    ref-key="outputAmountRef"
    :input="state.context.outputAmount"
    :base-denom="state.context.outputCoin?.baseDenom"
    :denom="state.context.outputCoin?.denom"
    :chain="getOutputChainFromRoute(state.context)"
    :is-loading-chain="state.matches('updating.routes')"
    :is-loading-amount="state.matches('updating.routes.input')"
    type="output"
    @select="swapStore.openAssetsMenu('output')"
    @update:input="send({ type: 'OUTPUT.CHANGE_AMOUNT', value: $event })"
  >
    <template #label> Receive </template>
    <template #header>
      <div
        v-if="isBestRouteSelected(state.context)"
        class="flex ml-auto font-normal text-muted -text-1 no-default-tippy-padding hover:text-link transition-colors"
      >
        <tippy class="ml-auto" placement="bottom-start" delay="0" :interactive="true" :arrow="false">
          <span class="flex items-center">Best price <Icon class="ml-1.5" name="StarIcon" :icon-size="0.875" /></span>

          <template #content>
            <SwapBestPriceDetails
              :number-of-exchanges-searched="countExchangesFromRoutes(state.context)"
              :dex="protocol"
              :expected-rate="getOrderPriceFromRoute(state.context, state.context.selectedRouteIndex)"
              :limit-price="getLimitPriceFromRoute(state.context, state.context.selectedRouteIndex)"
              :denom="state.context.outputCoin?.baseDenom"
              :max-slippage="state.context.maxSlippage"
              :min-received="getMinOutputAmountFromRoute(state.context, state.context.selectedRouteIndex)"
            />
          </template>
        </tippy>
      </div>
    </template>
  </SwapCoin>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import Icon from '@/components/ui/Icon.vue';
import {
  countExchangesFromRoutes,
  formatProtocolName,
  getLimitPriceFromRoute,
  getMinOutputAmountFromRoute,
  getOrderPriceFromRoute,
  getOutputChainFromRoute,
  getProtocolFromRoute,
  isBestRouteSelected,
} from '@/features/swap/logic';
import { useCurrentSwapRoute, useSwapActor, useSwapStore } from '@/features/swap/state';

import SwapBestPriceDetails from '../SwapBestPriceDetails.vue';
import SwapCoin from './SwapCoin.vue';

const swapStore = useSwapStore();
const { state, send } = useSwapActor();

const currentRoute = useCurrentSwapRoute();
const protocol = computed(() => formatProtocolName(getProtocolFromRoute(currentRoute.value)));
</script>
