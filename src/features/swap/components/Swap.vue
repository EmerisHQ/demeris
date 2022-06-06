<template>
  <div class="w-[320px] min-h-[432px] relative rounded-xl shadow-panel flex flex-col bg-surface dark:bg-fg">
    <template v-if="showConfirming">
      <SwapOverlayRouteDetail :route-index="selectedRouteIndex" class="!relative" @close="send('CANCEL')" />
    </template>

    <template v-else-if="isSignedIn && hasSubmitted">
      <TransactionProcessCreator
        :steps="state.context.data.steps"
        :emit-back="true"
        action="swap"
        class="flex-1 flex flex-col"
        @back="send({ type: 'STEPS.CLEAR' })"
        @close="send({ type: 'RESET' })"
        @pending="send({ type: 'RESET' })"
        @previous="send({ type: 'STEPS.CLEAR' })"
      />
    </template>

    <div v-else class="flex flex-col justify-between space-y-8 flex-1 p-6">
      <div class="flex items-center justify-between">
        <h2 class="text-2 font-bold">{{ $t('components.swap.title') }}</h2>
        <Button variant="link" rounded :click-function="swapStore.toggleSettings">
          <Icon name="ThreeDotsIcon" :icon-size="1.5" />
        </Button>
      </div>

      <div class="flex flex-col space-y-7">
        <SwapCoinInput />
        <div class="flex items-center justify-between">
          <div class="border-t border-border w-full absolute left-0" />
          <SwapButtonSwitch />
          <SwapButtonRoute />
        </div>
        <SwapCoinOutput />
      </div>

      <div>
        <SwapButtonSwap :state="state" :send="send" />
        <div v-if="state.matches('updating')" class="flex items-center justify-between mt-5">
          <SkeletonLoader height="12px" width="74px" />
          <SkeletonLoader height="12px" width="74px" />
        </div>

        <div v-if="state.context.data.steps.length" class="-text-1 mt-5 -mb-6">
          <FeeLevelSelector :steps="state.context.data.steps" />
        </div>
      </div>
    </div>

    <SwapOverlaySettings />
    <SwapOverlayRoutes />
    <SwapOverlayAssets />
  </div>
</template>

<script lang="ts" setup>
import { whenever } from '@vueuse/core';
import { computed, nextTick, watch } from 'vue';

import FeeLevelSelector from '@/components/common/FeeLevelSelector.vue';
import SkeletonLoader from '@/components/common/loaders/SkeletonLoader.vue';
import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';
import useAccount from '@/composables/useAccount';
import SwapButtonSwap from '@/features/swap/components/SwapButton/SwapButtonSwap.vue';
import { useSwapMachine, useSwapStore } from '@/features/swap/state';
import TransactionProcessCreator from '@/features/transactions/components/TransactionProcessCreator.vue';
import { GlobalGetterTypes } from '@/store';
import { useStore } from '@/utils/useStore';

import SwapButtonRoute from './SwapButton/SwapButtonRoute.vue';
import SwapButtonSwitch from './SwapButton/SwapButtonSwitch.vue';
import SwapCoinInput from './SwapCoin/SwapCoinInput.vue';
import SwapCoinOutput from './SwapCoin/SwapCoinOutput.vue';
import SwapOverlayAssets from './SwapOverlay/SwapOverlayAssets.vue';
import SwapOverlayRouteDetail from './SwapOverlay/SwapOverlayRouteDetail.vue';
import SwapOverlayRoutes from './SwapOverlay/SwapOverlayRoutes.vue';
import SwapOverlaySettings from './SwapOverlay/SwapOverlaySettings.vue';

const props = defineProps(['canStart', 'defaultDenom']);
const globalStore = useStore();
const swapStore = useSwapStore();
const { state, send } = useSwapMachine(props.defaultDenom);
const { allbalances, isValidatingBalances } = useAccount();

const isBalancesLoaded = computed(() => {
  return globalStore.getters[GlobalGetterTypes.USER.isAllBalancesLoaded] && !isValidatingBalances.value;
});
const isSignedIn = computed(() => globalStore.getters[GlobalGetterTypes.USER.isSignedIn]);
const hasSubmitted = computed(() => state.value.matches('submitted'));
const showConfirming = computed(() => state.value.matches('ready.confirming'));
const selectedRouteIndex = computed(() => state.value.context.selectedRouteIndex);

const setAllBalances = async () => {
  if (!isBalancesLoaded.value) return;

  await nextTick();

  if (!state.value.can({ type: 'BALANCES.SET' })) return;
  send({ type: 'BALANCES.SET', balances: allbalances.value });
};

const startMachine = () => {
  if (!state.value.can('START')) return;
  send({ type: 'SLIPPAGE.CHANGE', value: '1' });
  send('START');
};

watch([isBalancesLoaded, allbalances, isSignedIn], setAllBalances, { immediate: true, deep: true });
whenever(() => props.canStart, startMachine, { immediate: true });
</script>
