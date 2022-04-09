<template>
  <SwapOverlay v-if="swap.shownRoutes">
    <template #title> Quotes </template>
    <template #actions>
      <Button variant="link" @click="swap.toggleRoutes">Done</Button>
    </template>
    <template #subtitle>Fees included</template>
  </SwapOverlay>
</template>

<script lang="ts" setup>
import Button from '@/components/ui/Button.vue';

import { useSwapStore } from '../swapStore';
import SwapOverlay from './SwapOverlay.vue';

const swap = useSwapStore();
</script>
