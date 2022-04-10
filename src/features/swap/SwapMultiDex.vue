<template>
  <div
    class="w-[320px] min-h-[432px] max-h-[552px] p-6 relative rounded-lg shadow-panel border-2 overflow-hidden flex flex-col"
  >
    <div class="flex flex-col justify-between space-y-8 flex-1">
      <div class="flex items-center justify-between">
        <h2 class="text-2 font-bold">{{ $t('components.swap.title') }}</h2>
        <Button variant="link" rounded @click="swap.toggleSettings">
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
      <Button v-else :disabled="['ready.invalid', 'booting'].some(state.matches)">Swap</Button>
    </div>

    <SwapOverlaySettings />
    <SwapOverlayRoutes />
    <SwapOverlayAssets />
  </div>
</template>

<script lang="ts" setup>
import { whenever } from '@vueuse/core';
import { useMachine } from '@xstate/vue';
import { nextTick } from 'vue';

import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';
import useAccount from '@/composables/useAccount';

import SwapButtonRoute from './components/SwapButtonRoute.vue';
import SwapButtonSwitch from './components/SwapButtonSwitch.vue';
import SwapCoinInput from './components/SwapCoinInput.vue';
import SwapCoinOutput from './components/SwapCoinOutput.vue';
import SwapOverlayAssets from './components/SwapOverlayAssets.vue';
import SwapOverlayRoutes from './components/SwapOverlayRoutes.vue';
import SwapOverlaySettings from './components/SwapOverlaySettings.vue';
import { swapMachine } from './swapMachine';
import { useSwapStore } from './swapStore';

const swap = useSwapStore();

const { allLoaded, balances } = useAccount();
const { state, send, service } = useMachine(swapMachine);

swap.setActor(service);

whenever(
  allLoaded,
  async () => {
    if (!state.value.can('BALANCES.SET')) return;

    await nextTick();
    send({ type: 'BALANCES.SET', balances: balances.value });
  },
  { immediate: true },
);
</script>
