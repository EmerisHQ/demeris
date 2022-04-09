<template>
  <IconButton
    v-if="['updating', 'available'].some(state.matches)"
    type="text"
    class="bg-surface -text-1"
    status="normal"
    :data="{ type: 'custom', function: swap.toggleRoutes }"
  >
    <div v-if="state.matches('updating')" class="flex items-center">
      <div class="absolute" style="transform: scale(0.4) translateX(-2.4rem)">
        <Spinner :size="2.5" />
      </div>
      <span class="ml-5">Finding the best price</span>
    </div>
    <div v-else class="flex items-center">
      <CircleSymbol size="xs" denom="uosmo" :display-status="false" />
      <span class="ml-1">Osmosis</span>
    </div>
  </IconButton>
</template>

<script lang="ts" setup>
import CircleSymbol from '@/components/common/CircleSymbol.vue';
import IconButton from '@/components/ui/IconButton.vue';
import Spinner from '@/components/ui/Spinner.vue';

import { useSwapStore } from '../swapStore';

const swap = useSwapStore();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { state } = swap.useSwapMachine();
</script>
