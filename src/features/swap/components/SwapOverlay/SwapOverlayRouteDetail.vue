<template>
  <SwapOverlay>
    <template #title> Swap route </template>
    <template #actions>
      <Button variant="link" size="sm" @click="emit('close')">
        <Icon name="CloseIcon" :icon-size="1.5" />
      </Button>
    </template>
    <template #caption>
      {{ swapRouteSubTitle }}
    </template>

    <dl class="timeline-container relative space-y-5 mt-2">
      <template v-for="(steps, index) in routeDetail" :key="index">
        <dt class="timeline-denom flex items-center space-x-4 mb-5">
          <CircleSymbol :display-status="false" :denom="steps[0].baseDenomIn" />
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
            <span v-if="step.type === 'pool'"
              >Swap to <Ticker :name="step.baseDenomOut" /> on {{ formatProtocolName(getProtocolFromStep(step)) }}</span
            >
            <span v-else-if="step.type === 'ibc'">Transfer to <ChainName :name="step.chainOut" /></span>
          </dd>
        </template>
      </template>

      <dt class="flex items-center space-x-4">
        <CircleSymbol
          :display-status="false"
          :denom="state.context.outputCoin?.baseDenom"
          :chain-name="state.context.outputCoin?.chain"
        />
        <div>
          <span class="font-medium"><Ticker :name="state.context.outputCoin?.denom" /></span>
          <span class="text-muted"> · <ChainName :name="getOutputChainFromRoute(state.context, routeIndex)" /></span>
        </div>
      </dt>

      <span hidden class="absolute top-0 left-4 transform -translate-x-1/2 w-[2px] h-full bg-border block -z-[1]" />
    </dl>

    <Button v-if="state.matches('ready.confirming')" class="pt-8" name="Continue" @click="onConfirm" />
  </SwapOverlay>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import ChainName from '@/components/common/ChainName.vue';
import CircleSymbol from '@/components/common/CircleSymbol.vue';
import Ticker from '@/components/common/Ticker.vue';
import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';
import {
  countChainsFromRoute,
  countTransactionsFromRoute,
  formatProtocolName,
  getDetailsFromRoute,
  getOutputChainFromRoute,
  getProtocolFromStep,
} from '@/features/swap/logic';
import { useSwapActor } from '@/features/swap/state';

import SwapOverlay from './SwapOverlay.vue';

const props = defineProps<{ routeIndex: number }>();
const emit = defineEmits(['close']);

const { t } = useI18n({ useScope: 'global' });
const { state, send } = useSwapActor();

const routeDetail = computed(() => getDetailsFromRoute(state.value.context, props.routeIndex));

const onConfirm = () => {
  send('CONFIRM');
};

const swapRouteSubTitle = computed(() => {
  const numberOfTransactions = countTransactionsFromRoute(state.value.context, props.routeIndex);
  const numberOfChains = countChainsFromRoute(state.value.context, props.routeIndex);

  if (numberOfChains <= 1) {
    return t('components.swap.transaction', { txs: numberOfTransactions }, numberOfTransactions);
  } else {
    // @ts-ignore
    return t(
      'components.swap.transactionAcrossChains',
      { chains: numberOfChains, txs: numberOfTransactions },
      numberOfTransactions,
    );
  }
});
</script>

<style lang="postcss" scoped>
.timeline-sub-item {
  & + .timeline-sub-item {
    @apply mt-2;
  }
}
</style>
