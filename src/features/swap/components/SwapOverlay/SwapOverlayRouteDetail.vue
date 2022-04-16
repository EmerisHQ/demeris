<template>
  <SwapOverlay>
    <template #title> Swap route </template>
    <template #actions>
      <Button variant="link" size="sm" @click="emit('close')">
        <Icon name="CloseIcon" :icon-size="1.5" />
      </Button>
    </template>
    <template #caption>
      {{ selectedRoute.steps.length }} transactions across {{ countChainsFromRoute(state.context, routeIndex) }} chains
    </template>

    <dl class="timeline-container relative space-y-5 mt-2">
      <template v-for="(steps, index) in routeDetail" :key="index">
        <dt class="timeline-denom flex items-center space-x-4 mb-5">
          <CircleSymbol :denom="steps[0].baseDenomIn" />
          <div>
            <span class="font-medium"><Ticker :name="steps[0].baseDenomIn" /></span>
            <span class="text-muted"> &middot; <ChainName :name="steps[0].chainIn" /></span>
          </div>
        </dt>

        <template v-for="(step, stepIndex) in steps" :key="stepIndex">
          <dd class="timeline-sub-item flex items-center space-x-4 -text-1">
            <div
              class="rounded-full bg-surface dark:bg-fg-solid flex items-center justify-center w-8 h-8 border-2 border-border"
            >
              <Icon v-if="step.type === 'pool'" class="relative" name="DaggSwapLRIcon" :icon-size="1" />
              <Icon v-else-if="step.type === 'ibc'" class="relative" name="DaggArrowRightIcon" :icon-size="1" />
            </div>
            <span v-if="step.type === 'pool'">Swap on {{ formatProtocolName(getProtocolFromStep(step)) }}</span>
            <span v-else-if="step.type === 'ibc'">Transfer to <ChainName :name="step.chainOut" /></span>
          </dd>
        </template>
      </template>

      <dt class="flex items-center space-x-4">
        <CircleSymbol :denom="state.context.outputCoin?.baseDenom" :chain-name="state.context.outputCoin?.chain" />
        <div>
          <span class="font-medium"><Ticker :name="state.context.outputCoin?.denom" /></span>
          <span class="text-muted"> · <ChainName :name="state.context.outputCoin?.chain" /></span>
        </div>
      </dt>

      <span hidden class="absolute top-0 left-4 transform -translate-x-1/2 w-[2px] h-full bg-border block -z-[1]" />
    </dl>
  </SwapOverlay>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import ChainName from '@/components/common/ChainName.vue';
import CircleSymbol from '@/components/common/CircleSymbol.vue';
import Ticker from '@/components/common/Ticker.vue';
import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';
import {
  countChainsFromRoute,
  formatProtocolName,
  getDetailsFromRoute,
  getProtocolFromStep,
} from '@/features/swap/logic';
import { useSwapStore } from '@/features/swap/state';

import SwapOverlay from './SwapOverlay.vue';

const props = defineProps<{ routeIndex: number }>();
const emit = defineEmits(['close']);

const swap = useSwapStore();
const { state } = swap.useSwapMachine();

const selectedRoute = computed(() => state.value.context.data.routes[props.routeIndex]);
const routeDetail = computed(() => getDetailsFromRoute(state.value.context, props.routeIndex));
</script>

<style lang="postcss" scoped>
.timeline-sub-item {
  & + .timeline-sub-item {
    @apply mt-2;
  }
}
</style>
