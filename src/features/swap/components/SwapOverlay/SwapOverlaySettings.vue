<template>
  <SwapOverlay v-if="swapStore.shownSettings" @esc="swapStore.toggleSettings">
    <template #title> Settings </template>
    <template #actions>
      <Button variant="link" @click="swapStore.toggleSettings">Done</Button>
    </template>

    <div class="flex flex-col">
      <CollapseDescription :is-open="isSlippageOpen" content-class="pb-4" @update:is-open="toggleSlippage">
        <template #title>Slippage tolerance</template>
        <template #label>{{ slippageValue }}%</template>

        <SwapSettingsSlippage />
      </CollapseDescription>
    </div>
  </SwapOverlay>
</template>

<script lang="ts" setup>
import { useToggle } from '@vueuse/core';
import { computed } from 'vue';

import Button from '@/components/ui/Button.vue';
import { useSwapStore } from '@/features/swap/state';

import CollapseDescription from '../shared/CollapseDescription.vue';
import SwapSettingsSlippage from '../SwapSettings/SwapSettingsSlippage.vue';
import SwapOverlay from './SwapOverlay.vue';

const swapStore = useSwapStore();

const [isSlippageOpen, toggleSlippage] = useToggle(false);

const slippageValue = computed(() => swapStore.slippage || 0.5);
</script>
