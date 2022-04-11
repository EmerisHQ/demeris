<template>
  <SwapOverlay>
    <template #title> Swap route </template>
    <template #actions>
      <Button variant="link" size="sm" @click="emit('close')">
        <Icon name="CloseIcon" :icon-size="1.5" />
      </Button>
    </template>
    <template #subtitle>{{ selectedRoute.steps.length }} transactions</template>
  </SwapOverlay>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import Button from '@/components/ui/Button.vue';
import Icon from '@/components/ui/Icon.vue';

import { useSwapStore } from '../swapStore';
import SwapOverlay from './SwapOverlay.vue';

const props = defineProps(['routeIndex']);
const emit = defineEmits(['close']);

const swap = useSwapStore();
const { state } = swap.useSwapMachine();

const selectedRoute = computed(() => state.value.context.data.routes[props.routeIndex]);
</script>
