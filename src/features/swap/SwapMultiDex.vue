<template>
  <div class="w-[320px] min-h-[432px] relative rounded-xl shadow-panel border-2 overflow-hidden flex flex-col">
    <template v-if="hasSubmitted">
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
        <Button variant="link" rounded :click-function="swap.toggleSettings">
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
        :disabled="['ready.invalid', 'ready.idle', 'booting'].some(state.matches)"
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
import { useMachine } from '@xstate/vue';
import { computed, nextTick, watch } from 'vue';

import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';
import useAccount from '@/composables/useAccount';
import TransactionProcessCreator from '@/features/transactions/components/TransactionProcessCreator.vue';

import SwapButtonRoute from './components/SwapButton/SwapButtonRoute.vue';
import SwapButtonSwitch from './components/SwapButton/SwapButtonSwitch.vue';
import SwapCoinInput from './components/SwapCoin/SwapCoinInput.vue';
import SwapCoinOutput from './components/SwapCoin/SwapCoinOutput.vue';
import SwapOverlayAssets from './components/SwapOverlay/SwapOverlayAssets.vue';
import SwapOverlayRoutes from './components/SwapOverlay/SwapOverlayRoutes.vue';
import SwapOverlaySettings from './components/SwapOverlay/SwapOverlaySettings.vue';
import { swapMachine } from './swapMachine';
import { useSwapStore } from './swapStore';

const swap = useSwapStore();

const { balances } = useAccount();
const { state, send, service } = useMachine(swapMachine);

swap.setService(service);

const hasSubmitted = computed(() => state.value.matches('submitted'));

watch(
  balances,
  async () => {
    if (!state.value.can({ type: 'BALANCES.SET', balances: [] })) return;

    await nextTick();
    send({ type: 'BALANCES.SET', balances: balances.value });
  },
  { deep: true, immediate: true },
);
</script>
