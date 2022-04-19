<template>
  <div class="w-[320px] min-h-[432px] relative rounded-xl shadow-panel flex flex-col bg-surface dark:bg-fg">
    <template v-if="isSignedIn && hasSubmitted">
      <TransactionProcessCreator
        :steps="state.context.data.steps"
        action="swap"
        class="flex-1 flex flex-col"
        @close="send({ type: 'RESET' })"
        @pending="send({ type: 'RESET' })"
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

      <Button v-if="state.matches('unavailable')" disabled>Swap unavailable</Button>
      <Button
        v-else
        :status="state.matches('ready.submitting') ? 'loading' : 'active'"
        :disabled="!state.can('SUBMIT')"
        @click="send('SUBMIT')"
      >
        Swap
      </Button>
    </div>

    <SwapOverlaySettings />
    <SwapOverlayRoutes />
    <SwapOverlayAssets />
  </div>
</template>

<script lang="ts" setup>
import { whenever } from '@vueuse/core';
import { useMachine } from '@xstate/vue';
import { computed, nextTick, watch } from 'vue';

import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';
import useAccount from '@/composables/useAccount';
import { swapMachine, useSwapStore } from '@/features/swap/state';
import TransactionProcessCreator from '@/features/transactions/components/TransactionProcessCreator.vue';
import { GlobalGetterTypes } from '@/store';
import { useStore } from '@/utils/useStore';

import SwapButtonRoute from './SwapButton/SwapButtonRoute.vue';
import SwapButtonSwitch from './SwapButton/SwapButtonSwitch.vue';
import SwapCoinInput from './SwapCoin/SwapCoinInput.vue';
import SwapCoinOutput from './SwapCoin/SwapCoinOutput.vue';
import SwapOverlayAssets from './SwapOverlay/SwapOverlayAssets.vue';
import SwapOverlayRoutes from './SwapOverlay/SwapOverlayRoutes.vue';
import SwapOverlaySettings from './SwapOverlay/SwapOverlaySettings.vue';

const props = defineProps(['canStart', 'defaultDenom']);
const globalStore = useStore();
const swapStore = useSwapStore();

const { balances, isValidatingBalances } = useAccount();

const isBalancesLoaded = computed(() => {
  return globalStore.getters[GlobalGetterTypes.USER.isAllBalancesLoaded] && !isValidatingBalances.value;
});
const isSignedIn = computed(() => globalStore.getters[GlobalGetterTypes.USER.isSignedIn]);
const hasSubmitted = computed(() => state.value.matches('submitted'));

const setAllBalances = async () => {
  if (!isBalancesLoaded.value) return;
  if (!state.value.can({ type: 'BALANCES.SET' })) return;

  await nextTick();
  send({ type: 'BALANCES.SET', balances: balances.value });
};

const startMachine = () => {
  if (!state.value.can('START')) return;
  send('START');
};

const { state, send, service } = useMachine(swapMachine, {
  context: {
    defaultInputDenom: props.defaultDenom,
  },
  services: {
    getAvailableDenoms: () => swapStore.syncAvailableDenoms(),
    getSwaps: () => swapStore.syncSwaps(),
  },
});

swapStore.setService(service);

watch([isBalancesLoaded, balances], setAllBalances, { immediate: true, deep: true });
whenever(() => props.canStart, startMachine, { immediate: true });
</script>
