<template>
  <IconButton
    v-if="canShow"
    :data="{ type: 'custom', function: swap.toggleRoutes }"
    type="text"
    class="bg-surface -text-1"
    status="normal"
    :disabled="state.matches('updating')"
  >
    <div v-if="state.matches('updating')" class="flex items-center">
      <div class="absolute" style="transform: scale(0.4) translateX(-2.4rem)">
        <Spinner :size="2.5" />
      </div>
      <span class="ml-5">Finding the best price</span>
    </div>
    <div v-else-if="currentProtocol" class="flex items-center">
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

import { formatProtocolName, getChainFromProtocol, getCurrentRoute, getProtocolFromRoute } from '../../swapHelpers';
import { useSwapStore } from '../../swapStore';

const swap = useSwapStore();

const { state } = swap.useSwapMachine();

const canShow = computed(() => {
  if (['ready.idle', 'booting'].some(state.value.matches)) return false;
  if (!state.value.matches('updating') && !getCurrentRoute(state.value.context)) return false;
  return true;
});

const currentProtocol = computed(() => {
  const route = getCurrentRoute(state.value.context);
  if (!route) return;
  const protocol = getProtocolFromRoute(route);
  const chain = getChainFromProtocol(protocol);

  return {
    chain: chain,
    name: formatProtocolName(protocol),
  };
});
</script>
