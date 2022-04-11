<template>
  <SwapOverlay>
    <template #title> Swap route </template>
    <template #actions>
      <Button variant="link" size="sm" @click="emit('close')">
        <Icon name="CloseIcon" :icon-size="1.5" />
      </Button>
    </template>
    <template #subtitle>{{ selectedRoute.steps.length }} transactions</template>

    <dl class="relative">
      <template v-for="(steps, index) in routeDetail" :key="index">
        <dt class="flex items-center space-x-4 mb-5">
          <CircleSymbol :denom="steps[0].baseDenomIn" />
          <div>
            <span class="font-medium"><Ticker :name="steps[0].baseDenomIn" /></span>
            <span class="text-muted"> · <ChainName :name="steps[0].chainIn" /></span>
          </div>
        </dt>

        <template v-for="(step, stepIndex) in steps" :key="stepIndex">
          <dd class="flex items-center space-x-4 mb-4 -text-1">
            <div class="rounded-full bg-bg flex items-center justify-center w-8 h-8 border-2 border-border">
              <Icon v-if="step.type === 'pool'" class="relative" name="DaggSwapLRIcon" :icon-size="1" />
              <Icon v-else-if="step.type === 'ibc'" class="relative" name="DaggArrowRightIcon" :icon-size="1" />
            </div>
            <span v-if="step.type === 'pool'">Swap on {{ formatProtocolName(step.protocol) }}</span>
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

      <span class="absolute top-0 left-4 transform -translate-x-1/2 w-[2px] h-full bg-border block -z-[1]" />
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

import { formatProtocolName, getRouteDetails } from '../../swapMachineHelpers';
import { useSwapStore } from '../../swapStore';
import SwapOverlay from './SwapOverlay.vue';

const props = defineProps(['routeIndex']);
const emit = defineEmits(['close']);

const swap = useSwapStore();
const { state } = swap.useSwapMachine();

const selectedRoute = computed(() => state.value.context.data.routes[props.routeIndex]);
const routeDetail = computed(() => getRouteDetails(state.value.context, props.routeIndex));
</script>
