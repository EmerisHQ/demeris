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

      <Button>Swap</Button>
    </div>

    <SwapOverlaySettings />
    <SwapOverlayRoutes />
    <SwapOverlayAssets />
  </div>
</template>

<script lang="ts" setup>
import { useMachine } from '@xstate/vue';
import { computed, nextTick } from 'vue';
import { watch } from 'vue';

import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';
import useAccount from '@/composables/useAccount';
import { GlobalGetterTypes } from '@/store';
import { useStore } from '@/utils/useStore';

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
const globalStore = useStore();

const { send, service } = useMachine(swapMachine);
const { balances } = useAccount();

const firstLoad = computed(() => globalStore.getters[GlobalGetterTypes.USER.getBalancesFirstLoad]);

swap.setActor(service);

watch(firstLoad, async () => {
  await nextTick();
  send({ type: 'UPDATE_BALANCES', balances: balances.value });
});
</script>
