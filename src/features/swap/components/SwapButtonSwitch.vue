<template>
  <IconButton
    :disabled="!state.can('COINS.SWITCH')"
    class="-ml-0.5 text-text bg-surface"
    :name="'UpsideDownIcon'"
    :type="'circle'"
    :icon-size="1"
    :status="'normal'"
    :data="{
      type: 'custom',
      function: handleClick,
    }"
  />
</template>

<script lang="ts" setup>
import IconButton from '@/components/ui/IconButton.vue';

import { useSwapStore } from '../swapStore';

const swap = useSwapStore();
const { state, send } = swap.useSwapMachine();

const handleClick = () => send('COINS.SWITCH');
</script>
