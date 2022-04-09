<template>
  <SwapOverlay v-if="swap.shownSettings">
    <template #title> Settings </template>
    <template #actions>
      <Button variant="link" @click="swap.toggleSettings">Done</Button>
    </template>
  </SwapOverlay>
</template>

<script lang="ts" setup>
import Button from '@/components/ui/Button.vue';

import { useSwapStore } from '../swapStore';
import SwapOverlay from './SwapOverlay.vue';

const swap = useSwapStore();
</script>
