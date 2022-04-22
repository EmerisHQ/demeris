<template>
  <SwapCoin
    :input="state.context.outputAmount"
    :denom="state.context.outputCoin?.denom"
    :chain="getOutputChainFromRoute(state.context)"
    :chain-fallback="resolveDisplayName(state.context?.outputCoin?.baseDenom)"
    :is-loading-chain="state.matches('updating.routes')"
    :is-loading-amount="state.matches('updating.routes.input')"
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
              :expected-rate="getOrderPrice(state.context)"
              :limit-price="getLimitPrice(state.context)"
              :denom="state.context.outputCoin?.baseDenom"
              :max-slippage="swapStore.slippage"
              :min-received="state.context.outputAmount"
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
  getCurrentRoute,
  getLimitPrice,
  getOrderPrice,
  getOutputChainFromRoute,
  getProtocolFromRoute,
  isBestRouteSelected,
  resolveDisplayName,
} from '@/features/swap/logic';
import { useSwapStore } from '@/features/swap/state';

import SwapBestPriceDetails from '../SwapBestPriceDetails.vue';
import SwapCoin from './SwapCoin.vue';

const swapStore = useSwapStore();
const { state, send } = swapStore.useSwapMachine();

const currentRoute = computed(() => getCurrentRoute(state.value.context));
const protocol = computed(() => formatProtocolName(getProtocolFromRoute(currentRoute.value)));
</script>
