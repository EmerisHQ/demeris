<template>
  <IconButton
    v-if="['updating', 'ready.pending', 'ready.valid', 'ready.invalid'].some(state.matches)"
    :data="{ type: 'custom', function: swap.toggleRoutes }"
    type="text"
    class="bg-surface -text-1"
    status="normal"
  >
    <div v-if="state.matches('updating')" class="flex items-center">
      <div class="absolute" style="transform: scale(0.4) translateX(-2.4rem)">
        <Spinner :size="2.5" />
      </div>
      <span class="ml-5">Finding the best price</span>
    </div>
    <div v-else class="flex items-center">
      <CircleSymbol size="xs" variant="chain" :chain-name="currentProtocol.chain" :display-status="false" />
      <span class="ml-1.5">{{ currentProtocol.name }}</span>
    </div>
  </IconButton>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import CircleSymbol from '@/components/common/CircleSymbol.vue';
import IconButton from '@/components/ui/IconButton.vue';
import Spinner from '@/components/ui/Spinner.vue';

import {
  formatProtocolName,
  getChainFromProtocol,
  getCurrentRoute,
  getProtocolFromRoute,
} from '../../swapMachineHelpers';
import { useSwapStore } from '../../swapStore';

const swap = useSwapStore();

const { state } = swap.useSwapMachine();
const currentProtocol = computed(() => {
  const route = getCurrentRoute(state.value.context);
  const protocol = getProtocolFromRoute(route);
  const chain = getChainFromProtocol(protocol);

  return {
    chain: chain,
    name: formatProtocolName(protocol),
  };
});
</script>
