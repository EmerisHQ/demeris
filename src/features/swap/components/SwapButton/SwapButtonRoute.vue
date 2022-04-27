<template>
  <IconButton
    v-if="canShow"
    :data="onClick"
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

    <div v-else-if="numberOfExchanges >= 2" class="flex items-center">
      <CircleSymbol size="xs" variant="chain" :chain-name="protocols[0].chain" :display-status="false" />
      <span class="ml-1.5">{{ numberOfExchanges }} DEXs</span>
    </div>

    <div v-else-if="protocols.length" class="flex items-center">
      <CircleSymbol size="xs" variant="chain" :chain-name="protocols[0].chain" :display-status="false" />
      <span class="ml-1.5">{{ protocols[0].name }}</span>
    </div>
  </IconButton>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import CircleSymbol from '@/components/common/CircleSymbol.vue';
import IconButton from '@/components/ui/IconButton.vue';
import Spinner from '@/components/ui/Spinner.vue';
import { formatProtocolName, getChainFromProtocol, getProtocolsFromRoute } from '@/features/swap/logic';
import { useCurrentSwapRoute, useSwapActor, useSwapStore } from '@/features/swap/state';
import { ButtonFunctionData } from '@/types/util';

const swapStore = useSwapStore();
const { state } = useSwapActor();
const currentRoute = useCurrentSwapRoute();

const canShow = computed(() => {
  if (['ready.idle', 'booting', 'idle'].some(state.value.matches)) return false;
  if (!state.value.matches('updating') && !currentRoute.value) return false;
  return true;
});

const onClick = { type: 'custom', function: swapStore.toggleRoutes } as ButtonFunctionData;

const numberOfExchanges = computed(() => protocols.value.length);

const protocols = computed(() => {
  if (!currentRoute.value) return [];

  const protocols = getProtocolsFromRoute(currentRoute.value);
  return protocols.map((protocol) => {
    return { chain: getChainFromProtocol(protocol), name: formatProtocolName(protocol) };
  });
});
</script>
